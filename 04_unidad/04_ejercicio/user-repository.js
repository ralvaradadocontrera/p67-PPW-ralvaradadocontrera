import DBLocal from 'db-local'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal( { path: './db' } )

const Session = Schema('Session', {
    _id: {type: String, required: true},
    user: { type: String, required: true },
    expires: { type: Date, required: true }
})

const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})

export class UserRepository {
    static async create({ username, password }) {
        Validation.username( username )
        Validation.password( password )

        const user = User.findOne( { username } )
        if (user) throw new Error( 'Username already exists.' )

        const id = crypto.randomUUID()
        const hashedPassword = await bcrypt.hashSync(password, SALT_ROUNDS)

        User.create({
            _id:id,
            username,
            password: hashedPassword
        }).save()

        return id
    }

    static async login({ username, password }) {
        Validation.username( username )
        Validation.password( password )

        const user = User.findOne( { username } )
        if (!user) throw new Error( 'username does not exist.' )
        
        const is_valid = await bcrypt.compareSync(password, user.password)
        if (!is_valid) throw new Error('password is invalid')
        
        const { password: _, ... publicUser } = user

        return publicUser
    }
}

class Validation {
    static username(username) {
        if (typeof username !== 'string') throw new Error('username must be a string')
        if (username.length < 3) throw new Error('username must be at least 3 characters long')
    }
    static password(password) {
        if (typeof password !== 'string') throw new Error('password must be a string')
        if (password.length < 6) throw new Error('password must be at least 6 characters long')
    }
}