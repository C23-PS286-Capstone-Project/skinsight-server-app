import path from 'path'
import { Router } from 'express'
import multer from 'multer'
import { login, refreshToken, register, verifyToken } from '../controllers/auth/AuthController'
import authenticatedMiddleware from '../middleware/authenticated'
import imageUploadMiddleware from '../middleware/uploadImage'
import { updateUser } from '../controllers/user/UserController'
import { predict } from '../controllers/ModelController';
import { createHistory } from '../controllers/history/HistoryController'

// Validations
import { createValidation as registerUserValidation } from '../validations/RegitserValidation'
import { updateValidation as updateUserValidation } from '../validations/UserValidation'
import { createValidation as createHistoryValidation } from '../validations/HistoryValidation'

// const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      return callback(new Error('Only image files are supported'))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const loadAuthRouter = app => {
    const router = Router()
    router.route('/login').post(login)
    router.route('/register').post(...registerUserValidation, register)
  router.use(authenticatedMiddleware);
  router.route('/verify').get(verifyToken);
  router.route('/refresh').post(refreshToken);

  app.use('/auth', router);
};

export const loadUserRouter = app => {
    const router = Router()

    router.use(authenticatedMiddleware)
    router.route('/update').post(...updateUserValidation, updateUser)
    
    app.use('/user', router)
}

export const loadModelRouter = app => {
    const router = Router()
    router.use(authenticatedMiddleware)
  router.post('/predict', upload.single('image'), predict);

  app.use('/image', router)
};

export const loadHistoryRouter = app => {
  const router = Router()
  router.use(authenticatedMiddleware)
  router.post('/create', imageUploadMiddleware(upload.single('image')), ...createHistoryValidation, createHistory)

  app.use('/history', router)
}
