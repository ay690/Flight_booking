'use client';

import { 
  PaymentElement, 
  useStripe, 
  useElements
} from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { confirmBooking } from '@/store/slices/bookingSlice';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
  grandTotal: number;
  clientSecret: string | null;
}

export default function CheckoutForm({ 
  grandTotal, 
  clientSecret
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStripeReady, setIsStripeReady] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    console.log('CheckoutForm state:', {
      stripeReady: !!stripe,
      elementsReady: !!elements,
      hasClientSecret: !!clientSecret,
      isStripeReady
    });
  }, [stripe, elements, clientSecret, isStripeReady]);

  // Check if Stripe and Elements are loaded
  useEffect(() => {
    if (stripe && elements) {
      console.log('Stripe and Elements are ready');
      setIsStripeReady(true);
    } else {
      console.log('Waiting for Stripe and Elements to load...');
      setIsStripeReady(false);
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate required elements
    if (!stripe || !elements) {
      const errorMsg = !stripe ? 'Payment system not ready' : 'Payment form not initialized';
      console.error('Payment submission error:', { 
        error: errorMsg, 
        stripe: !!stripe, 
        elements: !!elements
      });
      setError(`Payment system error: ${errorMsg}. Please refresh the page and try again.`);
      return;
    }

    if (!clientSecret) {
      const errorMsg = 'Payment session expired. Please refresh the page and try again.';
      console.error('Payment submission error: No client secret');
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsProcessing(true);
    console.log('Submitting payment...');

    try {
      // First, validate the form elements
      const { error: elementsError } = await elements.submit();
      if (elementsError) {
        throw new Error(elementsError.message || 'Please complete the payment form');
      }

      // Then confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          receipt_email: 'customer@example.com', // Consider collecting email from user
        },
        redirect: 'if_required',
      });

      console.log('Payment result:', { stripeError, paymentIntent });

      if (stripeError) {
        // Handle specific Stripe errors
        if (stripeError.type === 'card_error' || stripeError.type === 'validation_error') {
          throw new Error(stripeError.message || 'Card validation failed');
        } else {
          throw new Error(stripeError.message || 'Payment failed');
        }
      }

      if (!paymentIntent) {
        throw new Error('No payment response received');
      }

      // Handle different payment intent statuses
      switch (paymentIntent.status) {
        case 'succeeded':
          console.log('Payment succeeded!', paymentIntent);
          toast.success(`Payment successful! You can check your bookings in 'My Bookings'`);
          dispatch(confirmBooking());
          router.push('/payment/success');
          break;
          
        case 'processing':
          toast.info('Payment processing...');
          setError('Your payment is processing. We will update you when payment is received.');
          break;
          
        case 'requires_payment_method':
          setError('Your payment was not successful. Please try again with a different payment method.');
          break;
          
        case 'requires_action':
          toast.info('Please complete the authentication steps for your payment.');
          // Stripe.js will automatically handle the next step
          break;
          
        default:
          console.warn('Unhandled payment status:', paymentIntent.status);
          setError(`Payment status: ${paymentIntent.status}. We will update you on the status of your payment.`);
          break;
      }
    } catch (err) {
      const error = err as Error & { code?: string; type?: string };
      console.error('Payment error:', {
        name: error.name,
        message: error.message,
        code: error.code,
        type: error.type,
        stack: error.stack,
      });
      
      const userFriendlyError = error.message || 'An unexpected error occurred during payment';
      setError(userFriendlyError);
      toast.error(`Payment failed: ${userFriendlyError}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentElementOptions = {
    layout: 'tabs' as const
  };

  // Show loading state if Stripe or Elements aren't ready
  if (!isStripeReady || !clientSecret) {
    return (
      <div className="text-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading payment form...</p>
        <div className="mt-2 text-sm text-muted-foreground">
          {!stripe && <p>Initializing payment system...</p>}
          {!elements && <p>Setting up payment form...</p>}
          {!clientSecret && <p>Connecting to payment processor...</p>}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <PaymentElement options={paymentElementOptions} />
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full py-6 text-base"
            size="lg"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${grandTotal.toLocaleString('en-IN')}`
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
