const API_URL = 'http://localhost:3000/user'

document.addEventListener('DOMContentLoaded', getUsers)

async function getUsers() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.error) {
            console.error("Error del servidor:", data.error);
            return;
        }

        renderTable(data.body);
    } catch (error) {
        console.error("Error al conectar con el servicio:", error);
        // Datos de prueba por si el servicio está caído (puedes borrar esto)
        console.log("Asegúrate de que tu servidor en localhost:3000 esté corriendo.");
    }
}

function renderTable(users) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpiar tabla

    users.forEach(user => {
        // Formatear fecha para mostrar solo YYYY-MM-DD
        const birthDate = user.date_birth ? user.date_birth.split('T')[0] : 'N/A';

        const row = document.createElement('tr');
        row.id = `row-${user._id}`;
        row.innerHTML = `
            <td class="td-user"><strong>${user.user}</strong></td>
            <td class="td-name">${user.name}</td>
            <td class="td-lastname">${user.last_name}</td>
            <td class="td-birth">${birthDate}</td>
            <td>
                <button class="btn btn-edit" onclick="prepareEdit('${user._id}', '${user.user}', '${user.name}', '${user.last_name}', '${birthDate}')">Editar</button>
                <button class="btn btn-delete" onclick="confirmDelete('${user._id}', '${user.user}')">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Funciones de Modal
function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

document.getElementById('formAdd').addEventListener('submit', async (e) => {
    console.log('Ingresar')
    e.preventDefault()
    const formData = new FormData(e.target)
    const newUser = Object.fromEntries(formData.entries())

    try {
        const res = await fetch(API_URL, {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( newUser )
        })
        if (res.ok) {
            alert('Usuario creado.')
            closeModal('modalAdd')
            e.target.reset()
            getUsers()
        }
    } catch(err) {
        alert('Error al insertar')
    }
})

// Cargar datos en el modal de edición
function prepareEdit(id) {
    const row = document.getElementById('row-' + id);
    document.getElementById('editUser').value = row.querySelector('.td-user').innerText;
    document.getElementById('editName').value = row.querySelector('.td-name').innerText;
    document.getElementById('editLastName').value = row.querySelector('.td-lastname').innerText;
    document.getElementById('editBirth').value = row.querySelector('.td-birth').innerText;
    openModal('modalEdit');
}

// Confirmación de eliminación
function confirmDelete(id) {
    const usuario = document.getElementById('row-' + id).querySelector('.td-user').innerText;
    if (confirm(`¿Está seguro de que desea eliminar al usuario "${usuario}"? Esta acción no se puede deshacer.`)) {
        document.getElementById('row-' + id).remove();
        alert("Registro eliminado.");
    }
}

// Buscador simple
function filterTable() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#userTable tbody tr');
    rows.forEach(row => {
        const userText = row.querySelector('.td-user').innerText.toLowerCase();
        row.style.display = userText.includes(query) ? '' : 'none';
    });
}

// Cerrar modales si se hace clic fuera de ellos
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
    }
}
