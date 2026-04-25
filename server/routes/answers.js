import express from 'express';
import { addAnswer, deleteAnswer } from '../controllers/answers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// This route is mounted at /api/v1/answers
router.delete('/:id', protect, deleteAnswer);

export default router;
