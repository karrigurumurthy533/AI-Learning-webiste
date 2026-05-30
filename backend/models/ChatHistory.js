import mongoose from 'mongoose';


const chatHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
            default: null,
        },
        messages: [
            {
                role: {
                    type: String,
                    enum: ['user', 'assistant', 'system'],
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                    trim: true,
                },
                timestamp:{
                    type:Date,
                    default:Date.now
                },
                relevantChunks: {
                    type: [Number],
                    default: [],
                },
            },
 
        ],
    },
    {
        timestamps: true,
    }
);

// ✅ Indexes
chatHistorySchema.index({ userId: 1, documentId: 1 });

export default mongoose.model('ChatHistory', chatHistorySchema);