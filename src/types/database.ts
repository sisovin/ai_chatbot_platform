export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  credits: number;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  _id?: string;
  userId: string;
  type: 'purchase' | 'usage' | 'refund';
  amount: number;
  credits: number;
  description: string;
  paymentMethod?: 'card' | 'qr';
  paymentId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface ChatMessage {
  _id?: string;
  userId: string;
  model: string;
  prompt: string;
  response: string;
  creditsUsed: number;
  createdAt: Date;
}

export interface ImageGeneration {
  _id?: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  parameters: {
    width?: number;
    height?: number;
    style?: string;
  };
  creditsUsed: number;
  createdAt: Date;
}