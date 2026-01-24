const storage = require('./storage')

function addUser( data ) {
    return new Promise( (resolve, reject) => {
        if (!data.user || !data.password || !data.name || !data.last_name) {
            reject( 'Ingresar los datos solicitados.' )
        } else {
            resolve( storage.add( data ) )
        } 
    } )
}

function getUser( data ) {
    return new Promise( (resolve, reject) => {
        if (data)
            resolve( storage.get( data ) )
        else
            reject('not-exist')
    } )
}

function updateUser( data ) {
    return new Promise( (resolve, reject) => {
        if (!data.user || !data.name || !data.last_name) {
            reject('Ingresar los datos solicitados.')
        } else {
            resolve( storage.update( data ) )
        }
    } )
}

function deleteUser( data ) {
    return new Promise( (resolve, reject) => {
        if (!data.user) {
            reject('Ingresar los datos solicitados.')
        } else {
            resolve( storage.delete( data ) )
        }
    } )
}

module.exports = {
    addUser,
    getUser,
    updateUser,
    deleteUser
}