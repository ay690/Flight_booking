import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

export async function POST(request: Request) {
  try {
    const { amount, customerName, customerAddress } = await request.json();
    
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }

    // Validate required address fields for Indian export compliance
    const requiredAddressFields = ['line1', 'city', 'state', 'postal_code', 'country'];
    const missingFields = requiredAddressFields.filter(field => !customerAddress?.[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required address fields: ${missingFields.join(', ')}`,
          missingFields
        },
        { status: 400 }
      );
    }

    // Convert amount to paise (smallest currency unit for INR)
    const amountInPaise = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: 'inr',
      description: 'Flight booking',
      metadata: {
        integration_check: 'accept_a_payment',
        customer_name: customerName,
      },
      shipping: {
        name: customerName,
        address: {
          line1: customerAddress.line1,
          line2: customerAddress.line2 || '',
          city: customerAddress.city,
          state: customerAddress.state,
          postal_code: customerAddress.postal_code,
          country: customerAddress.country || 'IN',
        },
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error('Failed to create payment intent: No client secret received');
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Handle non-Error objects
    if (!(error instanceof Error)) {
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      );
    }

    // Type assertion for Stripe error
    const stripeError = error as Error & {
      code?: string;
      type?: string;
      statusCode?: number;
    };

    // Prepare error response
    const errorResponse: {
      error: string;
      code?: string;
      type?: string;
    } = {
      error: stripeError.message || 'Failed to create payment intent',
    };

    // Only include code and type if they exist
    if (stripeError.code) errorResponse.code = stripeError.code;
    if (stripeError.type) errorResponse.type = stripeError.type;

    return NextResponse.json(
      errorResponse,
      { status: stripeError.statusCode || 500 }
    );
  }
}
