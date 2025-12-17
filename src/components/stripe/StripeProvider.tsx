import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const publishableKey = 'pk_test_51RtOUrInJvZVDGUG2ht92pBcFUNUhInu7ZK7tIKXOeQ8VdsnUsUj2I4I5XOXw85yKgfp0KrMQWGSyAx0lYrv3Bg100qUaQJzCe';

if (!publishableKey) {
  console.error('VITE_STRIPE_PUBLISHABLE_KEY is not defined. Please add it to your .env file.');
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#ea580c', // Orange-600 to match your theme
        colorBackground: '#ffffff',
        colorText: '#374151',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  if (!stripePromise) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-800 text-sm">
          Stripe is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={clientSecret ? options : { appearance: options.appearance }}>
      {children}
    </Elements>
  );
}
