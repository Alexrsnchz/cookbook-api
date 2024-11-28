import cors from 'cors';

const corsOptions = {
  origin: 'https://cookbook-web-murex.vercel.app/login',
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
