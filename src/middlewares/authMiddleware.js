import jwt from 'jsonwebtoken';
import config from '../config/settings.js';

const { JWT_SECRET_KEY } = config;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res
      .status(401)
      .json({ status: 'error', message: 'User unauthenticated' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    req.user = payload;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: 'error', message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
