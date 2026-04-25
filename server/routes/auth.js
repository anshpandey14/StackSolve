import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, socialLogin, verifyEmail } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { success: false, error: 'Too many requests from this IP, please try again after 15 minutes' }
});

router.post(
    '/register',
    authLimiter,
    [
        body('name', 'Name is required').not().isEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    register
);

router.post(
    '/login',
    authLimiter,
    [
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password is required').exists()
    ],
    login
);

router.post('/social-login', socialLogin);
router.get('/me', protect, getMe);
router.get('/verifyemail/:token', verifyEmail);

export default router;
