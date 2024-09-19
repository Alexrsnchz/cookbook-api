import express from 'express';
import usersRouter from './routes/users.js';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middlewares/corsMiddleware.js';

const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(cookieParser());

  app.use('/api/users', usersRouter);

  return app;
};

export default createApp;
