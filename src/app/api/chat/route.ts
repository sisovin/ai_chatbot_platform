import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { ChatMessage } from '@/models/Content';
import { getUserFromRequest } from '@/lib/auth';
import axios from 'axios';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

// Credit costs per model
const MODEL_COSTS = {
  'llama2': 1,
  'codellama': 2,
  'mistral': 1,
  'neural-chat': 1,
  'default': 1,
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { prompt, model = 'llama2' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get user and check credits
    const user = await User.findById(userPayload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const creditsRequired = MODEL_COSTS[model as keyof typeof MODEL_COSTS] || MODEL_COSTS.default;
    
    if (user.credits < creditsRequired) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    try {
      // Call Ollama API
      const ollamaResponse = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model,
        prompt,
        stream: false,
      }, {
        timeout: 30000, // 30 second timeout
      });

      const response = ollamaResponse.data.response;

      // Deduct credits from user
      user.credits -= creditsRequired;
      await user.save();

      // Create transaction record
      const transaction = new Transaction({
        userId: user._id,
        type: 'usage',
        amount: 0,
        credits: -creditsRequired,
        description: `Text generation with ${model}`,
        status: 'completed',
      });
      await transaction.save();

      // Save chat message
      const chatMessage = new ChatMessage({
        userId: user._id,
        model,
        prompt,
        response,
        creditsUsed: creditsRequired,
      });
      await chatMessage.save();

      return NextResponse.json({
        response,
        creditsUsed: creditsRequired,
        remainingCredits: user.credits,
      });

    } catch (ollamaError: any) {
      console.error('Ollama API error:', ollamaError);
      
      if (ollamaError.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: 'Ollama service is not available. Please ensure Ollama is running.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to generate text. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}