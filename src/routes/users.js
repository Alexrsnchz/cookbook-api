import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const usersRouter = Router();

usersRouter.get('/', UserController.getAllUsers);
usersRouter.post('/register', UserController.register);
usersRouter.post('/login', UserController.login);

usersRouter.get('/:id', UserController.getUserById);
usersRouter.patch('/:id', authMiddleware, UserController.updateUser);
usersRouter.delete('/:id', authMiddleware, UserController.deleteUser);

export default usersRouter;
