import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('views'));
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    const token = req.cookies.access_token
    if (!token)
        return res.render('index')

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY)
        res.render('index', data)
    } catch(error) {
        res.render('index')
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    
    try {
        const user = await UserRepository.login({ username, password })
        const token = jwt.sign( { id:user._id, username:user.username }, SECRET_JWT_KEY, {
            expiresIn: '1h'
        } )
        res
            .cookie('access_token', token, {
                httpOnly: true, // la cookie solo se puede acceder en el servidor.
                secure: process.env.NODE_ENV == 'production', // la cookie solo se puede acceder en https
                sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
                maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora 
            })
            .send( {user, token} )
    } catch(error) {
        res.status(400).send(error.message)
    }
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body

    try {
        const id = await UserRepository.create({ username, password })
        res.send( {id} )
    } catch(error) {
        res.status(400).send(error.message)
    }
})
app.post('/logout', (req, res) => {
    res
        .clearCookie('access_token')
        .json({ message: 'Logout successful' })
})

app.get('/protected', (req, res) => {
    const token = req.cookies.access_token
    if (!token)
        return res.status(403).send('Access not authorized')

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY)
        res.render('protected', data) // { _id, username }
    } catch(error) {
        return res.status(401).send('Access not authorized')
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/`)
})