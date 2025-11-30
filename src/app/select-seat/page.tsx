"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

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

// Lazy load the SeatSelection component
const LazySeatSelection = dynamic(
  () => import('@/components/seat-selection').then((mod) => mod.SeatSelection),
  {
    loading: () => (
      <div className="flex items-center justify-center p-12">
        <div className="space-y-4">
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
          </div>
          <div className="grid grid-cols-6 gap-2 max-w-2xl mx-auto">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function SelectSeatPage() {
  const booking = useSelector((state: RootState) => state.booking.currentBooking);
  const router = useRouter();

  useEffect(() => {
    if (!booking) {
      router.replace("/");
    } else if (!booking.flightDetails) {
      router.replace("/flights/search");
    }
  }, [booking, router]);

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">Loading booking details...</p>
          <Button onClick={() => router.push("/")}>Go Back to Search</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LazyHeader />
      <main className="flex-1 container mx-auto px-4 py-24">
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Select Your Seats</CardTitle>
            <CardDescription>
              Choose seats for {booking.passengers.length} passenger(s) for your flight from {booking.from} to {booking.to}.
            </CardDescription>
          </CardHeader>
          <Suspense fallback={
            <div className="flex items-center justify-center p-12">
              <div className="space-y-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
                </div>
                <div className="grid grid-cols-6 gap-2 max-w-2xl mx-auto">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <LazySeatSelection />
          </Suspense>
        </Card>
      </main>
    </div>
  );
}
