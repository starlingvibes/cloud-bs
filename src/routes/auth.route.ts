import express from 'express';
import {
  register,
  login,
  revokeUserSession,
} from '../controllers/auth.controller';
import { verifyAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

// Single route collection for users and admins, using admin_token
router.route('/register').post(register);
router.route('/login').post(login);

// admin-only routes
router.post('/revoke/:userId', verifyAdmin, revokeUserSession);

export default router;
