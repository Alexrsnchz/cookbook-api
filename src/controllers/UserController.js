import User from '../models/User.js';
import {
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
} from '../validations/UserSchema.js';
import bcrypt from 'bcrypt';

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAll();

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching users' });
    }
  }

  static async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await User.getById(Number(id));

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching user' });
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
          return res
            .status(409)
            .json({ message: 'That username is already registered' });
        }

        if (existentData.email === validatedData.email) {
          return res
            .status(409)
            .json({ message: 'That email is already registered' });
        }
      }

      const saltRounds = 10;
      const hash = await bcrypt.hash(validatedData.password, saltRounds);

      validatedData.password = hash;

      await User.create(validatedData);

      return res.status(201).json({ message: 'User registered' });
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }

      return res.status(500).json({ message: 'Error registering user' });
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
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      return res.status(200).json({ message: 'User logged in' });
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }

      return res.status(500).json({ message: 'Error loggin in user' });
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
      const validatedData = userUpdateSchema.parse(data);
      const user = await User.update(Number(id), validatedData);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User updated' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const user = await User.delete(Number(id));

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting user' });
    }
  }
}

export default UserController;
