import express from 'express';
import usersRouter from './routes/users.js';
import cookieParser from 'cookie-parser';
import config from './config/settings.js';
import { corsMiddleware } from './middlewares/corsMiddleware.js';

const app = express();
const { PORT } = config;

app.disable('x-powered-by');
app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser());

app.use('/api/users', usersRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
