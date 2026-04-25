import { Schema, model } from 'mongoose';

const answerSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Please add content'],
        maxlength: [10000, 'Content can not be more than 10000 characters']
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: Schema.ObjectId,
        ref: 'Question',
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Update answersCount in Question when a new answer is added
answerSchema.post('save', async function() {
    await this.constructor.updateAnswersCount(this.question);
});

// Update answersCount in Question when an answer is deleted
answerSchema.pre('remove', async function() {
    await this.constructor.updateAnswersCount(this.question);
});

answerSchema.statics.updateAnswersCount = async function(questionId) {
    const count = await this.countDocuments({ question: questionId });
    try {
        await model('Question').findByIdAndUpdate(questionId, {
            answersCount: count
        });
    } catch (err) {
        console.error(err);
    }
};

export default model('Answer', answerSchema);
