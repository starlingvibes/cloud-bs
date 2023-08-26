import express from 'express';
import { register, login } from '../controllers/auth.controller';

const router = express.Router();

// Single route collection for admins and users
router.route('/register').post(register);
router.route('/login').post(login);

export default router;
