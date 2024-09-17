import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'JWT-SECRET-KEY',
};

export default config;
