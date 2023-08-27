import express from 'express';
import { register, login } from '../controllers/auth.controller';

const router = express.Router();

// Single route collection for users and admins, using admin_token
router.route('/register').post(register);
router.route('/login').post(login);

export default router;
