import express from 'express';
import { createVote } from '../controllers/votes.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createVote);

export default router;
