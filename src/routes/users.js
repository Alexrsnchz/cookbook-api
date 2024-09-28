import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import authenticationMiddleware from './../middlewares/authenticationMiddleware.js';
import userAuthorizationMiddleware from '../middlewares/userAuthorizationMiddleware.js';

const usersRouter = Router();

usersRouter.get('/', UserController.getAllUsers);
usersRouter.post('/register', UserController.register);
usersRouter.post('/login', UserController.login);

usersRouter.get('/:id', UserController.getUserById);
usersRouter.patch(
  '/:id',
  authenticationMiddleware,
  userAuthorizationMiddleware,
  UserController.updateUser
);
usersRouter.delete(
  '/:id',
  authenticationMiddleware,
  userAuthorizationMiddleware,
  UserController.deleteUser
);

export default usersRouter;
