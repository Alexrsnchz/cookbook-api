import express from 'express';
import config from './config/settings.js';
import { corsMiddleware } from './middlewares/corsMiddleware.js';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.js';
import recipesRouter from './routes/recipes.js';

const app = express();
const { PORT } = config;

app.disable('x-powered-by');
app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/recipes', recipesRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
