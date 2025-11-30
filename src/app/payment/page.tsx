'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { IndianRupee, Luggage, Plus, Minus, User, Plane } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { updateBooking } from '@/store/slices/bookingSlice';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Lazy load the Header component
const LazyHeader = dynamic(
  () => import('@/components/header').then((mod) => mod.Header),
  { 
    loading: () => (
      <div className="fixed top-0 left-0 right-0 z-30 bg-card shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <Plane className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">SkyRoute</span>
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load the CheckoutForm component
const LazyCheckoutForm = dynamic(
  () => import('@/components/checkout-form').then((mod) => mod.default),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="h-10 bg-muted rounded animate-pulse"></div>
      </div>
    ),
    ssr: false,
  }
);

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const BAGGAGE_PRICE_PER_UNIT = 800;

export default function PaymentPage() {
  const booking = useSelector((state: RootState) => state.booking.currentBooking);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // ========== HOOKS MUST ALWAYS RUN! ==========
  const [bagCount, setBagCount] = useState(0);
  const [clientSecret, setClientSecret] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'IN',
  });

  // Redirect + initial booking-based setup
  useEffect(() => {
    if (!booking) {
      router.replace('/');
      return;
    }

    // Initialize bag count AFTER booking arrives
    setBagCount(booking.bags || 0);

    // Redirect if flow is incomplete
    if (!booking.flightDetails) {
      router.replace('/flights/search');
      return;
    }

    if (!booking.passengers.every((p) => !!p.seat)) {
      router.replace('/select-seat');
    }
  }, [booking, router]);

  // ❗ SAFETY: If booking is null, show loader (no early return before hooks)
  if (!booking) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Redirecting...
      </div>
    );
  }

  // ================= CALCULATIONS =================
  const flightPrice = booking.flightDetails?.price || 0;
  const totalFlightCost = flightPrice * booking.passengers.length;
  const totalSeatCost = booking.passengers.reduce(
    (acc, p) => acc + (p.seat?.price || 0),
    0
  );
  const totalBaggageCost = bagCount * BAGGAGE_PRICE_PER_UNIT;

  const grandTotal = totalFlightCost + totalSeatCost + totalBaggageCost;

  // Create Stripe payment intent when form is submitted
  const handlePaymentIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardholderName.trim()) {
      toast.error('Please enter the cardholder name');
      return;
    }

    const requiredAddressFields = ['line1', 'city', 'state', 'postal_code', 'country'];
    const missingFields = requiredAddressFields.filter(field => !address[field as keyof typeof address]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required address fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setClientSecret(''); // Reset client secret to show loading state
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: grandTotal,
          customerName: cardholderName,
          customerAddress: address
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      console.log("Payment Intent response:", data);
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error('No client secret in response');
      }
    } catch (error: unknown) {
      console.error("Error creating payment intent:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
      toast.error(errorMessage);
    }
  };


  // Stripe appearance
  const appearance: StripeElementsOptions['appearance'] = {
    theme: 'stripe',
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  // ================= HANDLERS =================
  const handleBagsChange = (amount: number) => {
    const newBagCount = Math.max(0, bagCount + amount);
    setBagCount(newBagCount);
    dispatch(updateBooking({ bags: newBagCount }));
  };

  // ================= UI =================
  // Debug logging
  console.log("Rendering payment page with clientSecret:", !!clientSecret);
  console.log("Stripe loaded:", !!stripePromise);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LazyHeader />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Complete Your Booking</CardTitle>
              <CardDescription>
                Add baggage and enter payment details to confirm your flight.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* ================= SUMMARY ================= */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">Booking Summary</h3>

                <div className="flex justify-between text-sm">
                  <span>Flights ({booking.passengers.length} passengers)</span>
                  <span>
                    <IndianRupee size={12} className="inline-block -mt-1" />
                    {totalFlightCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Seat Selection</span>
                  <span>
                    <IndianRupee size={12} className="inline-block -mt-1" />
                    {totalSeatCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Extra Baggage ({bagCount} bags)</span>
                  <span>
                    <IndianRupee size={12} className="inline-block -mt-1" />
                    {totalBaggageCost.toLocaleString()}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount Due</span>
                  <span>
                    <IndianRupee size={16} className="inline-block -mt-1" />
                    {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ================= EXTRA BAGGAGE ================= */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Extra Baggage</Label>
                  <div className="flex items-center gap-4 mt-2 p-3 border rounded-lg">
                    <Luggage className="h-6 w-6 text-primary" />
                    <div className="grow">
                      <p className="font-medium">Add checked bags</p>
                      <p className="text-sm text-muted-foreground">
                        (
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          + <IndianRupee size={12} className="-mt-0.5" />
                          {BAGGAGE_PRICE_PER_UNIT}
                        </span>{' '}
                        per bag)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleBagsChange(-1)}
                        disabled={bagCount <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="font-bold text-lg w-5 text-center">
                        {bagCount}
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleBagsChange(1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ================= PAYMENT ================= */}
                <form onSubmit={handlePaymentIntent} className="space-y-4">
                  <Label className="text-base font-semibold">
                    Payment Details
                  </Label>

                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Name on Card</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          className="pl-10"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Address Line 1"
                        value={address.line1}
                        onChange={(e) =>
                          setAddress({ ...address, line1: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="City"
                        value={address.city}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                      />
                      <Input
                        placeholder="State"
                        value={address.state}
                        onChange={(e) =>
                          setAddress({ ...address, state: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Postal Code"
                        value={address.postal_code}
                        onChange={(e) =>
                          setAddress({ ...address, postal_code: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Country"
                        value={address.country}
                        onChange={(e) =>
                          setAddress({ ...address, country: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-4"
                    disabled={!cardholderName || !address.line1 || !address.city || !address.state || !address.postal_code || !address.country}
                  >
                    Pay ₹{grandTotal.toLocaleString()}
                  </Button>
                </form>

                {clientSecret && (
                  <Suspense fallback={
                    <div className="space-y-4">
                      <div className="h-12 bg-muted rounded animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                      </div>
                      <div className="h-10 bg-muted rounded animate-pulse"></div>
                    </div>
                  }>
                    <Elements
                      key={clientSecret}
                      options={options}
                      stripe={stripePromise}
                    >
                      <LazyCheckoutForm
                        grandTotal={grandTotal}
                        clientSecret={clientSecret}
                      />
                    </Elements>
                  </Suspense>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
