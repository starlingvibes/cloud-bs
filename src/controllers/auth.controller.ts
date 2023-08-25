import express, { Request, Response } from 'express';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { UserService } from '../services/user.service';

const router = express.Router();
const userService = new UserService();

const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userService.createUser(
      fullName,
      email,
      role,
      hashedPassword
    );
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userService = new UserService();
    const user = await userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
};

export { register, login };
