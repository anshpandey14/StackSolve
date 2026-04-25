import Comment from "../models/Comment.js";

// @desc    Get comments for a question or answer
// @route   GET /api/v1/comments?type=question&typeId=xxx
// @access  Public
export const getComments = async (req, res) => {
  const { type, typeId } = req.query;

  try {
    const filter = {};
    if (type) filter.type = type;
    if (typeId) filter.typeId = typeId;

    const comments = await Comment.find(filter)
      .populate("author", "name reputation")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: comments });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create comment
// @route   POST /api/v1/comments
// @access  Private
export const createComment = async (req, res) => {
  const { content, type, typeId } = req.body;

  try {
    const comment = await Comment.create({
      content,
      type,
      typeId,
      author: req.user.id,
    });

    const populated = await comment.populate("author", "name reputation");

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, error: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
