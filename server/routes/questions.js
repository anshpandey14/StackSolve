import express from "express";
import {
  getQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getTags,
} from "../controllers/questions.js";
import { addAnswer } from "../controllers/answers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getQuestions).post(protect, createQuestion);

router.get("/tags", getTags);

router
  .route("/:id")
  .get(getQuestion)
  .patch(protect, updateQuestion)
  .delete(protect, deleteQuestion);

// Nested route for answers
router.post("/:questionId/answers", protect, addAnswer);

export default router;
