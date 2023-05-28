import path from 'path'
import { Router } from 'express'
import multer from 'multer'
import { login, refreshToken, register, verifyToken } from '../controllers/auth/AuthController'
import authenticatedMiddleware from '../middleware/authenticated'

// Validations
import { createValidation as RegisterUserValidation } from '../validations/RegitserValidation'

export const loadAuthRouter = app => {
    const router = Router()

    router.route('/login').post(login)
    router.route('/register').post(...RegisterUserValidation, register)

    router.use(authenticatedMiddleware)
    router.route('/verify').get(verifyToken)
    router.route('/refresh').post(refreshToken)

    app.use('/auth', router)
}