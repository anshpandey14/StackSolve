import Vote from "../models/Vote.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import User from "../models/User.js";

export const createVote = async (req, res, next) => {
  const { type, typeId, voteStatus } = req.body;

  try {
    const typeModel = type === "question" ? "Question" : "Answer";

    const Model = type === "question" ? Question : Answer;
    const target = await Model.findById(typeId);
    if (!target) {
      return res
        .status(404)
        .json({ success: false, error: `${typeModel} not found` });
    }

    const existingVote = await Vote.findOne({ typeId, votedBy: req.user.id });

    if (existingVote) {
      if (existingVote.voteStatus === voteStatus) {
        // Same vote — toggle off, reverse the rep
        await existingVote.deleteOne();

        const voteIncrement = voteStatus === "upvoted" ? -1 : 1;
        await Model.findByIdAndUpdate(typeId, {
          $inc: { votes: voteIncrement },
        });

        // Reverse rep on the author
        const repIncrement = voteStatus === "upvoted" ? -1 : 1;
        await User.findByIdAndUpdate(target.author, {
          $inc: { reputation: repIncrement },
        });

        return res
          .status(200)
          .json({ success: true, data: null, message: "Vote removed" });
      } else {
        // Different vote — switch it, swing rep by 2
        existingVote.voteStatus = voteStatus;
        await existingVote.save();

        const voteIncrement = voteStatus === "upvoted" ? 2 : -2;
        await Model.findByIdAndUpdate(typeId, {
          $inc: { votes: voteIncrement },
        });

        // Swing rep by 2 (undo old + apply new)
        const repIncrement = voteStatus === "upvoted" ? 2 : -2;
        await User.findByIdAndUpdate(target.author, {
          $inc: { reputation: repIncrement },
        });

        return res.status(200).json({ success: true, data: existingVote });
      }
    }

    // New vote
    const vote = await Vote.create({
      type,
      typeId,
      typeModel,
      votedBy: req.user.id,
      voteStatus,
    });

    const voteIncrement = voteStatus === "upvoted" ? 1 : -1;
    await Model.findByIdAndUpdate(typeId, { $inc: { votes: voteIncrement } });

    // Update author's reputation
    const repIncrement = voteStatus === "upvoted" ? 1 : -1;
    await User.findByIdAndUpdate(target.author, {
      $inc: { reputation: repIncrement },
    });

    res.status(201).json({ success: true, data: vote });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
