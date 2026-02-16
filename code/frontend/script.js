let score = 0;
let timeLeft = 0;
let isJumping = false;
let obstacleSpeed = 8;
let difficulty = 1;
let gameInterval, timerInterval;
let currentCorrectAnswer;

const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');

// Iniciar
document.getElementById('start-button').addEventListener('click', () => {
    const name = document.getElementById('username-input').value;
    const time = document.getElementById('game-time-select').value;
    const diff = document.getElementById('difficulty-select').value;

    if(!name || !time || !diff) {
        alert("Completa todos los campos");
        return;
    }

    difficulty = parseInt(diff);
    obstacleSpeed = difficulty === 1 ? 8 : difficulty === 2 ? 12 : 16;
    timeLeft = parseInt(time);

    document.getElementById('display-name').innerText = name;
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-wrapper').classList.remove('hidden');

    startGame();
});

function startGame() {
    score = 0;
    updateScore();
    startTimer();
    moveObstacle();
}

// Salto
document.addEventListener('keydown', e => {
    if((e.code === "Space" || e.code === "ArrowUp") && !isJumping) {
        isJumping = true;
        player.style.bottom = "180px";
        setTimeout(() => {
            player.style.bottom = "0";
            isJumping = false;
        }, 500);
    }
});

function moveObstacle() {
    let pos = 800;
    gameInterval = setInterval(() => {
        pos -= obstacleSpeed;
        if(pos < -60) {
            pos = 800;
            score += 10 * difficulty;
            updateScore();
        }
        obstacle.style.right = (800 - pos) + "px";

        let playerBottom = parseInt(getComputedStyle(player).bottom);
        if(pos < 110 && pos > 50 && playerBottom < 40) {
            collision();
        }
    }, 20);
}

function collision() {
    clearInterval(gameInterval);
    document.getElementById('math-modal').classList.remove('hidden');
    generateMath();
}

function generateMath() {
    let n1 = Math.floor(Math.random()*10)+5;
    let n2 = Math.floor(Math.random()*10)+5;
    currentCorrectAnswer = n1 + n2;
    document.getElementById('math-question').innerText = `${n1} + ${n2}`;
}

document.getElementById('submit-answer').addEventListener('click', () => {
    const ans = parseInt(document.getElementById('math-answer').value);
    if(ans === currentCorrectAnswer) {
        document.getElementById('math-modal').classList.add('hidden');
        document.getElementById('math-answer').value = "";
        moveObstacle();
    } else {
        document.getElementById('math-feedback').innerText = "Respuesta incorrecta";
    }
});

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').innerText = `Tiempo: ${timeLeft}s`;
        if(timeLeft <= 0) endGame();
    }, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    alert(`Juego terminado. Puntaje: ${score}`);
    location.reload();
}

function updateScore() {
    document.getElementById('score-display').innerText = `Puntos: ${score}`;
}
