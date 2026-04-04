import express from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * 🔒 PUBLIC ROUTES
 */
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

/**
 * 🛡️ PROTECTED ROUTES
 */
router.get('/me', verifyToken, getMe);

export default router;
