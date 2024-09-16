import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const usersRouter = Router();

usersRouter.get('/', UserController.getAllUsers);
usersRouter.post('/register', UserController.register);
usersRouter.post('/login', UserController.login);

usersRouter.get('/:id', UserController.getUserById);
usersRouter.patch('/:id', UserController.updateUser);
usersRouter.delete('/:id', UserController.deleteUser);

export default usersRouter;
