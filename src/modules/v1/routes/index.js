import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import {
  login,
  refreshToken,
  verifyToken,
} from '../controllers/auth/AuthController';
import authenticatedMiddleware from '../middleware/authenticated';
import { predict } from '../controllers/ModelController';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

export const loadAuthRouter = app => {
  router.route('/login').post(login);

  router.use(authenticatedMiddleware);
  router.route('/verify').get(verifyToken);
  router.route('/refresh').post(refreshToken);

  app.use('/auth', router);
};

export const loadModelRouter = () => {
  router.post('/predict', upload.single('image'), predict);
};
