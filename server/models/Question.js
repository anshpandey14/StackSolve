import { Schema, model } from 'mongoose';

const questionSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
        maxlength: [10000, 'Content can not be more than 10000 characters']
    },
    tags: {
        type: [String],
        required: [true, 'Please add at least one tag']
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    attachmentId: {
        type: String
    },
    votes: {
        type: Number,
        default: 0
    },
    answersCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with virtuals
questionSchema.virtual('answers', {
    ref: 'Answer',
    localField: '_id',
    foreignField: 'question',
    justOne: false
});

export default model('Question', questionSchema);
