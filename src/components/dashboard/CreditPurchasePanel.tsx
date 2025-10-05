"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, QrCode, Check } from "lucide-react";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  features: string[];
}

interface CreditPurchasePanelProps {
  userCredits?: number;
  onCreditsUpdate?: (newCredits: number) => void;
}

const packages: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 5,
    features: [
      "Text generation",
      "Basic image creation",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    credits: 500,
    price: 20,
    popular: true,
    features: [
      "All text models",
      "High-res images",
      "Priority support",
      "Usage analytics",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 2000,
    price: 75,
    features: [
      "Unlimited access",
      "Custom models",
      "Dedicated support",
      "API access",
    ],
  },
];

export default function CreditPurchasePanel({ userCredits = 0, onCreditsUpdate }: CreditPurchasePanelProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePurchase = async () => {
    if (!selectedPackage) {
      setError("Please select a credit package");
      return;
    }

    setIsProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({
          package: selectedPackage,
          paymentMethod,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Purchase failed');
      }

      setSuccess(`Payment initiated successfully! Transaction ID: ${result.transactionId}`);
      
      // For demo purposes, simulate successful payment after 3 seconds
      setTimeout(() => {
        const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
        if (selectedPkg && onCreditsUpdate) {
          onCreditsUpdate(userCredits + selectedPkg.credits);
        }
        setSuccess("Credits added to your account successfully!");
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'An error occurred during purchase');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Purchase Credits</h2>
        <Badge variant="secondary" className="text-sm">
          Current: {userCredits} Credits
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select a Package</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all ${
                selectedPackage === pkg.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-primary/50'
              } ${pkg.popular ? 'border-primary' : ''}`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <CardHeader className="text-center relative">
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold">${pkg.price}</div>
                <CardDescription>{pkg.credits} Credits</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedPackage && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                Credit/Debit Card (ABA PayWay)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="qr" id="qr" />
              <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer">
                <QrCode className="h-4 w-4" />
                QR Code Payment
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      <div className="pt-4 border-t">
        <Button
          onClick={handlePurchase}
          disabled={!selectedPackage || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? 'Processing Payment...' : 'Purchase Credits'}
        </Button>
      </div>

      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>• Secure payment processing with ABA PayWay</p>
        <p>• Credits are added instantly after successful payment</p>
        <p>• All transactions are encrypted and secure</p>
      </div>
    </div>
  );
}