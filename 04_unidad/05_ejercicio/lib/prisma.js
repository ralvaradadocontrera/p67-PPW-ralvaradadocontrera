const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

// 1. Configuramos el pool de conexión de PostgreSQL
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// 2. Creamos el adaptador
const adapter = new PrismaPg(pool)

// 3. Pasamos el adaptador al cliente
const prisma = new PrismaClient({ adapter })

module.exports = prisma