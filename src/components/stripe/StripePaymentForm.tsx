import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StripePaymentFormProps {
  amount: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
  disabled?: boolean;
  loading?: boolean;
  studentId: number;
  classType: number;
  quantity: number;
  clientSecret?: string;
}

export function StripePaymentForm({
  amount,
  currency,
  onSuccess,
  onCancel,
  disabled = false,
  loading = false,
  studentId,
  classType,
  quantity,
  clientSecret,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentElementReady, setPaymentElementReady] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || isProcessing || disabled || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Confirm the payment using modern Stripe Elements approach with PaymentElement
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/credits/success`,
        },
        redirect: 'if_required', // Only redirect if required for 3D Secure
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.',
        });
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast({
        title: 'Payment Error',
        description: err.message || 'Failed to process payment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Payment Information</Label>
        <div className="text-xs text-gray-500 mb-1">
          Test Mode: Use card number 4242 4242 4242 4242
        </div>
        <div className="border rounded-lg p-3 bg-background">
          <PaymentElement
            onReady={() => setPaymentElementReady(true)}
            options={{
              layout: 'tabs'
            }}
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              {error.includes('card') && (
                <div className="mt-2 text-sm">
                  <strong>Test Card:</strong> 4242 4242 4242 4242
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Amount:</span>
          <span className="text-lg font-bold text-gray-900">
            {currency} {amount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleSubmit}
          disabled={!stripe || !paymentElementReady || isProcessing || disabled || loading}
          className="bg-orange-600 hover:bg-orange-700 flex-1"
          type="submit"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {isProcessing || loading ? 'Processing...' : `Pay ${currency} ${amount.toFixed(2)}`}
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing || loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
