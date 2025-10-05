import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  creditsUsed: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const ImageGenerationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  parameters: {
    width: Number,
    height: Number,
    style: String,
  },
  creditsUsed: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
export const ImageGeneration = mongoose.models.ImageGeneration || mongoose.model('ImageGeneration', ImageGenerationSchema);