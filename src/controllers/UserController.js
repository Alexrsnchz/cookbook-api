import User from '../models/User.js';
import {
  userRegisterSchema,
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
      const [usernameExists, emailExists] = Promise.all([
        User.getByUsername(validatedData.username),
        User.getByEmail(validatedData.email),
      ]);

      if (usernameExists) {
        return res
          .status(409)
          .json({ message: 'That username is already registered' });
      }

      if (emailExists) {
        return res
          .status(409)
          .json({ message: 'That email is already registered' });
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

  static async login(req, res) {}

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
