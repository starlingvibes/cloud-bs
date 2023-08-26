import express, { Request, Response } from 'express';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { UserService } from '../services/user.service';

const router = express.Router();
const userService = new UserService();

const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    if (req.body.adminToken === process.env.ADMIN_TOKEN) {
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await userService.createUser(
        fullName,
        email,
        'admin',
        hashedPassword
      );
      res.status(201).json(newUser);
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await userService.createUser(
        fullName,
        email,
        'user',
        hashedPassword
      );
      // TOD0: Create folder for user on signup
      return res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
          user: newUser,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'success',
      message: 'An error occurred whilst creating user',
      data: null,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userService = new UserService();
    const user = await userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, fullName: user.fullName },
      user.role === 'admin'
        ? process.env.JWT_SECRET_ADMIN
        : process.env.JWT_SECRET_USER,
      {
        expiresIn: '1h',
      }
    );

    return res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      data: {
        token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: `An error occurred whilst logging in - ${error.message}`,
      data: null,
    });
  }
};

export { register, login };
