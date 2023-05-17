import path from 'path'
import { Router } from 'express'
import multer from 'multer'
import { login, refreshToken, verifyToken } from '../controllers/auth/AuthController'
import authenticatedMiddleware from '../middleware/authenticated'

export const loadAuthRouter = app => {
    const router = Router()

    router.route('/login').post(login)

    router.use(authenticatedMiddleware)
    router.route('/verify').get(verifyToken)
    router.route('/refresh').post(refreshToken)

    app.use('/auth', router)
}