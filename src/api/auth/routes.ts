import { Router } from 'express';
import { AuthController } from './controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticate, AuthController.getMe);

// OAuth placeholder
// OAuth Routes
router.get('/oauth/google', AuthController.googleLogin);
router.get('/oauth/google/callback', AuthController.googleCallback);

router.get('/oauth/github', AuthController.githubLogin);
router.get('/oauth/github/callback', AuthController.githubCallback);

export default router;
