import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['question', 'answer']
    },
    typeId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'typeModel'
    },
    typeModel: {
        type: String,
        required: true,
        enum: ['Question', 'Answer']
    },
    votedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    voteStatus: {
        type: String,
        required: true,
        enum: ['upvoted', 'downvoted']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent multiple votes by same user on same target
voteSchema.index({ typeId: 1, votedBy: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);
