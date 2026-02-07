const router = require('express').Router()
const categoria = require('./../controllers/categoria')

router.post('/', categoria.crear_categoria)

module.exports = router