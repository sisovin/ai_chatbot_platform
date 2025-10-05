import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { ImageGeneration } from '@/models/Content';
import { getUserFromRequest } from '@/lib/auth';
import axios from 'axios';

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

const IMAGE_GENERATION_COST = 5; // Credits per image

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

    const { prompt, width = 512, height = 512, style = 'realistic' } = await request.json();

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

    if (user.credits < IMAGE_GENERATION_COST) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    try {
      // For demo purposes, we'll use a placeholder image service
      // In production, you would integrate with ImageKit's AI image generation
      const imageUrl = `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=${width}&h=${height}&q=80&fit=crop`;
      
      // In a real implementation, you would call ImageKit's API:
      // const imageKitResponse = await axios.post('https://api.imagekit.io/v1/ai/generate', {
      //   prompt,
      //   width,
      //   height,
      //   style,
      // }, {
      //   headers: {
      //     'Authorization': `Basic ${Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64')}`,
      //   },
      // });

      // Deduct credits from user
      user.credits -= IMAGE_GENERATION_COST;
      await user.save();

      // Create transaction record
      const transaction = new Transaction({
        userId: user._id,
        type: 'usage',
        amount: 0,
        credits: -IMAGE_GENERATION_COST,
        description: `Image generation: ${prompt.substring(0, 50)}...`,
        status: 'completed',
      });
      await transaction.save();

      // Save image generation record
      const imageGeneration = new ImageGeneration({
        userId: user._id,
        prompt,
        imageUrl,
        parameters: { width, height, style },
        creditsUsed: IMAGE_GENERATION_COST,
      });
      await imageGeneration.save();

      return NextResponse.json({
        imageUrl,
        creditsUsed: IMAGE_GENERATION_COST,
        remainingCredits: user.credits,
      });

    } catch (imageError: any) {
      console.error('Image generation error:', imageError);
      return NextResponse.json(
        { error: 'Failed to generate image. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}