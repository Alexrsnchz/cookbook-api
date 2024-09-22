import express from 'express';
import { corsMiddleware } from './middlewares/corsMiddleware.js';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.js';
import recipesRouter from './routes/recipes.js';

const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(cookieParser());

  app.use('/api/users', usersRouter);
  app.use('/api/recipes', recipesRouter);

  return app;
};

export default createApp;
