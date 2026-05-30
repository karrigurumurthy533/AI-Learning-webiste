import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
            required: true,
        },
        title: {
            type: String,
            required: false,
            trim: true,
        },

        cards: [
            {
                question: {
                    type: String,
                    required: true,
                },
                answer: {
                    type: String,
                    required: true,
                },
                difficulty: {
                    type: String,
                    enum: ['easy', 'medium', 'hard'],
                    default: 'medium',
                },
                lastReviewed: {
                    type: Date,
                    default: null,
                },
                reviewCount: {
                    type: Number,
                    default: 0,
                },
                isStarred: {
                    type: Boolean,
                    default: false

                }

            },
        ],
    },
    {
        timestamps: true,
    }
);

// ✅ compound index (same logic as quiz)
flashcardSchema.index({ userId: 1, documentId: 1 });


export default mongoose.model('Flashcard', flashcardSchema);