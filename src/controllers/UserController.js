import User from '../models/User.js';
import { z } from 'zod';
import {
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
} from '../validations/UserSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/settings.js';

const { JWT_SECRET_KEY } = config;

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAll();

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error fetching users' });
    }
  }

  static async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await User.getById(Number(id));

      if (!user) {
        return res
          .status(404)
          .json({ status: 'error', message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error fetching user' });
    }
  }

  static async register(req, res) {
    const data = req.body;

    try {
      const validatedData = userRegisterSchema.parse(data);
      const existentData = await User.getByUsernameOrEmail(
        validatedData.username,
        validatedData.email
      );

      if (existentData) {
        if (existentData.username === validatedData.username) {
          return res.status(409).json({
            status: 'error',
            message: 'That username is already registered',
          });
        }

        if (existentData.email === validatedData.email) {
          return res.status(409).json({
            status: 'error',
            message: 'That email is already registered',
          });
        }
      }

      const saltRounds = 10;
      const hash = await bcrypt.hash(validatedData.password, saltRounds);

      validatedData.password = hash;

      const user = await User.create(validatedData);
      const { password, ...userWithoutPassword } = user;

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET_KEY, {
        expiresIn: '1h',
      });

      return res
        .status(201)
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000,
          sameSite: 'none',
        })
        .json(userWithoutPassword);
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          message: err.message,
          path: err.path,
        }));
        return res
          .status(400)
          .json({ status: 'error', message: formattedErrors });
      }

      return res
        .status(500)
        .json({ status: 'error', message: 'Error registering user' });
    }
  }

  static async login(req, res) {
    const data = req.body;

    try {
      const validatedData = userLoginSchema.parse(data);
      const existingData = await User.getByUsernameOrEmail(
        null,
        validatedData.email
      );

      if (
        !existingData ||
        !(await bcrypt.compare(validatedData.password, existingData.password))
      ) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: existingData.id, role: existingData.role },
        JWT_SECRET_KEY,
        {
          expiresIn: '1h',
        }
      );

      return res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000,
          sameSite: 'none',
        })
        .json({ status: 'success', message: 'User logged in' });
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          message: err.message,
          path: err.path,
        }));
        return res
          .status(400)
          .json({ status: 'error', message: formattedErrors });
      }

      return res
        .status(500)
        .json({ status: 'error', message: 'Error loggin in user' });
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
      const validatedData = userUpdateSchema.parse(data);
      const user = await User.update(Number(id), validatedData);

      if (!user) {
        return res
          .status(404)
          .json({ status: 'error', message: 'User not found' });
      }

      const { password, ...userWithoutPassword } = user;

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error updating user' });
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const user = await User.delete(Number(id));

      if (!user) {
        return res
          .status(404)
          .json({ status: 'error', message: 'User not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error deleting user' });
    }
  }
}

export default UserController;
