import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { getUserFromRequest } from '@/lib/auth';

// Credit packages
const CREDIT_PACKAGES = {
  starter: { credits: 100, price: 5 },
  professional: { credits: 500, price: 20 },
  enterprise: { credits: 2000, price: 75 },
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

    const { package: packageType, paymentMethod } = await request.json();

    if (!packageType || !CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES]) {
      return NextResponse.json(
        { error: 'Invalid package' },
        { status: 400 }
      );
    }

    const user = await User.findById(userPayload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const selectedPackage = CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES];

    // Create pending transaction
    const transaction = new Transaction({
      userId: user._id,
      type: 'purchase',
      amount: selectedPackage.price,
      credits: selectedPackage.credits,
      description: `Credit purchase - ${packageType} package`,
      paymentMethod,
      status: 'pending',
    });
    await transaction.save();

    // For demo purposes, we'll simulate successful payment
    // In production, you would integrate with ABA PayWay or other payment processors
    
    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        // Update transaction status
        transaction.status = 'completed';
        await transaction.save();

        // Add credits to user
        user.credits += selectedPackage.credits;
        await user.save();
      } catch (error) {
        console.error('Payment processing error:', error);
      }
    }, 2000);

    return NextResponse.json({
      message: 'Payment initiated',
      transactionId: transaction._id,
      package: {
        type: packageType,
        credits: selectedPackage.credits,
        price: selectedPackage.price,
      },
    });

  } catch (error) {
    console.error('Purchase credits error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}