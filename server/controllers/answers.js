import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

// @desc    Add answer to question
// @route   POST /api/v1/questions/:questionId/answers
// @access  Private
export const addAnswer = async (req, res) => {
  req.body.question = req.params.questionId;
  req.body.author = req.user.id;

  try {
    const question = await Question.findById(req.params.questionId);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, error: "Question not found" });
    }

    const answer = await Answer.create(req.body);
    const populated = await answer.populate("author", "name reputation");

    // Update reputation
    await User.findByIdAndUpdate(req.user.id, { $inc: { reputation: 1 } });

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete answer
// @route   DELETE /api/v1/answers/:id
// @access  Private
export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res
        .status(404)
        .json({ success: false, error: "Answer not found" });
    }

    if (answer.author.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    await answer.deleteOne(); // fixed: was answer.remove() which is deprecated

    // Decrease reputation
    await User.findByIdAndUpdate(req.user.id, { $inc: { reputation: -1 } });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
