'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Plane } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <>
      <LazyHeader />
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your booking. Your payment has been processed successfully.
          </p>
          <p className="text-muted-foreground">
            A confirmation email has been sent to your registered email address.
          </p>
          <div className="pt-6">
            <Suspense fallback={
              <div className="h-12 bg-muted rounded w-32 mx-auto animate-pulse"></div>
            }>
              <Button 
                onClick={() => router.push('/')}
                className="px-6 py-6 text-base"
              >
                Return to Home
              </Button>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
