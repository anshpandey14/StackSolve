import express from "express";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comments.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/v1/comments?type=question&typeId=xxx
router.get("/", getComments);
router.post("/", protect, createComment);
router.delete("/:id", protect, deleteComment);

export default router;
