'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();

  return (
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
          <Button 
            onClick={() => router.push('/')}
            className="px-6 py-6 text-base"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
