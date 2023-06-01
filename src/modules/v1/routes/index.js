import path from 'path'
import { Router } from 'express'
import multer from 'multer'
import { login, refreshToken, register, verifyToken } from '../controllers/auth/AuthController'
import authenticatedMiddleware from '../middleware/authenticated'
import { updateUser } from '../controllers/user/UserController'

// Validations
import { createValidation as RegisterUserValidation } from '../validations/RegitserValidation'
import { updateValidation as UserUpdateValidation } from '../validations/UserValidation'

export const loadAuthRouter = app => {
    const router = Router()

    router.route('/login').post(login)
    router.route('/register').post(...RegisterUserValidation, register)

    router.use(authenticatedMiddleware)
    router.route('/verify').get(verifyToken)
    router.route('/refresh').post(refreshToken)

    // router.route('/profile').patch(updateUser)

    app.use('/auth', router)
}

export const loadUserRouter = app => {
    const router = Router()

    router.use(authenticatedMiddleware)
    router.route('/update').post(...UserUpdateValidation, updateUser)

    app.use('/user', router)
}