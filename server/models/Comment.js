import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Please add content'],
        maxlength: [600, 'Comment can not be more than 600 characters']
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['question', 'answer']
    },
    typeId: {
        type: Schema.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('Comment', commentSchema);
