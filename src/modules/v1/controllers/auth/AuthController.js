import { compare } from "bcrypt"
import { sign, decode } from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client"
import { validateForm } from "../../../../utils/helper"
import { hash, genSalt } from 'bcrypt'

const prisma = new PrismaClient()

const generateJwtToken = async user => {
    const jwtTokenPayload = {
        id: user.id,
        name: user.name
    }

    return sign(jwtTokenPayload, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || '60d', algorithm: 'HS256'
    })
}

export const verifyToken = async (req, res) => {
    return res.json({
        status: 'success',
        message: 'Token verified'
    })
}

export const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(422).json({
            status: 'fail',
            message: 'Username or password required'
        })
    }

    const user = await prisma.user.findUnique({
        where: { username: username }
    })

    // console.log(user)

    if (user != null && (await compare(password, user.password))) {
        const token = await generateJwtToken(user)
        res.json({
            status: 'success',
            message: 'Login success',
            data: { token, "Type": "Bearer" }
        })
    } else {
        res.status(401).json({
            status: 'fail',
            message: 'Wrong username or password'
        })
    }
}

export const refreshToken = async (req, res) => {
    const { exp: expiredTime, id: userId } = decode(req.headers.authorization.split(' ')[1])

    if (Date.now() > expiredTime * 1000) {
        return res.status(401).json({
            status: 'fail',
            message: 'Token is expired'
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    const newJwtToken = generateJwtToken(user)

    res.json({
        status: 'success',
        message: 'New token has been issued',
        token: newJwtToken
    })
}

export const register = async (req, res) => {
    const { name, gender, birthday, birthplace, address, email, username, password } = req.body

    try {
        if (validateForm(req, res)) {
            const user = await prisma.user.create({
                data: {
                    name: name,
                    gender: gender,
                    birthday: birthday,
                    birthplace: birthplace,
                    address: address,
                    email: email,
                    username: username,
                    password: await hash(password, await genSalt())
                }
            })
            res.status(201).json({
                status: 'success',
                message: 'Successfully created user',
                data: user
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Unknown error'
        })
    }
}