import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    try {
        const verificationToken = crypto.randomBytes(20).toString('hex');

        const user = await User.create({
            name,
            email,
            password,
            verificationToken
        });

        // For frontend, the URL would be different, but keeping API URL for simplicity
        // e.g. const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;
        // But for this backend-only implementation we can return an API route or frontend route.
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verifyemail/${verificationToken}`;

        const message = `Please confirm your email by clicking the following link: \n\n ${verificationUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification - StackSolve',
                message
            });

            res.status(200).json({ success: true, message: 'Please check your email to verify your account.' });
        } catch (err) {
            user.verificationToken = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, error: 'Email could not be sent' });
        }
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }
        res.status(500).json({ success: false, error: 'An error occurred during registration' });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ success: false, error: 'Please verify your email before logging in' });
        }

        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                reputation: user.reputation
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'An error occurred during login' });
    }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
};

// @desc    Social Login (Google/GitHub)
// @route   POST /api/v1/auth/social-login
// @access  Public
export const socialLogin = async (req, res, next) => {
    const { name, email, avatar } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // Create user if not exists
            // We use a dummy password since they use social login
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-10),
                avatar,
                isVerified: true
            });
        }

        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                reputation: user.reputation,
                avatar: user.avatar
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Verify email
// @route   GET /api/v1/auth/verifyemail/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during verification' });
    }
};
