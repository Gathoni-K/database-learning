import { Router } from 'express';
import * as authController from './auth.controller';
import { requireSupabaseAuth } from './auth.middleware';

const router = Router();

//PUBLIC ROUTES - no token needed
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


// PROTECTED ROUTES - token required, middleware runs first

router.post('/logout', requireSupabaseAuth, authController.logout);
router.post('/change-password', requireSupabaseAuth, authController.changePassword);
router.get('/me', requireSupabaseAuth, authController.getMe);

export default router;