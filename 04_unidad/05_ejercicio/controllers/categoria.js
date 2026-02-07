const prisma = require('../lib/prisma')

exports.crear_categoria = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(422).json( {error: 'Name is required.'} )
        }
        const nueva_categoria = await prisma.categoria.create({
            data: {
                name: req.body.name
            }
        })
        return res.status(201).json( nueva_categoria )
    } catch(error) {
        return res.status(500).json( {error: error.message} )
    }
}