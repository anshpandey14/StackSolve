import Question from "../models/Question.js";

// @desc    Get all questions (with optional tag filter)
// @route   GET /api/v1/questions?tag=react
// @access  Public
export const getQuestions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.tag) {
      filter.tags = { $in: [req.query.tag] };
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const questions = await Question.find(filter)
      .populate("author", "name reputation")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new question
// @route   POST /api/v1/questions
// @access  Private
export const createQuestion = async (req, res) => {
  req.body.author = req.user.id;

  try {
    const question = await Question.create(req.body);
    const populated = await question.populate("author", "name reputation");
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single question
// @route   GET /api/v1/questions/:id
// @access  Public
export const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "name reputation")
      .populate({
        path: "answers",
        populate: { path: "author", select: "name reputation" },
      });

    if (!question) {
      return res
        .status(404)
        .json({ success: false, error: "Question not found" });
    }

    res.status(200).json({ success: true, data: question });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update question
// @route   PATCH /api/v1/questions/:id
// @access  Private
export const updateQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, error: "Question not found" });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    question = await Question.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content, tags: req.body.tags },
      { new: true, runValidators: true },
    ).populate("author", "name reputation");

    res.status(200).json({ success: true, data: question });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all unique tags
// @route   GET /api/v1/questions/tags
// @access  Public
export const getTags = async (req, res) => {
  try {
    const tags = await Question.distinct("tags");
    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete question
// @route   DELETE /api/v1/questions/:id
// @access  Private
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, error: "Question not found" });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    await question.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
