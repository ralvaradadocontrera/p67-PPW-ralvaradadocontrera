const user = require('../components/user/interface')
//const city = require('../components/city/interface')

const routes = function( server ) {
    server.use('/user', user)
//    server.use('/city', user)
}

module.exports = routes