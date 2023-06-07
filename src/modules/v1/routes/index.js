import path from 'path'
import { Router } from 'express'
import multer from 'multer'
import { login, refreshToken, register, verifyToken } from '../controllers/auth/AuthController'
import authenticatedMiddleware from '../middleware/authenticated'
import { updateUser } from '../controllers/user/UserController'
import { predict } from '../controllers/ModelController';

// Validations
import { createValidation as RegisterUserValidation } from '../validations/RegitserValidation'
import { updateValidation as UserUpdateValidation } from '../validations/UserValidation'

// const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

export const loadAuthRouter = app => {
    const router = Router()
    router.route('/login').post(login)
    router.route('/register').post(...RegisterUserValidation, register)
  router.use(authenticatedMiddleware);
  router.route('/verify').get(verifyToken);
  router.route('/refresh').post(refreshToken);

  app.use('/auth', router);
};

export const loadUserRouter = app => {
    const router = Router()

    router.use(authenticatedMiddleware)
    router.route('/update').post(...UserUpdateValidation, updateUser)
    
    app.use('/user', router)
}

export const loadModelRouter = app => {
    const router = Router()
    router.use(authenticatedMiddleware)
  router.post('/predict', upload.single('image'), predict);

  app.use('/image', router)
};
