"use client";

import { Header } from "@/components/header";
import { SeatSelection } from "@/components/seat-selection";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24">
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Select Your Seats</CardTitle>
            <CardDescription>
              Choose seats for {booking.passengers.length} passenger(s) for your flight from {booking.from} to {booking.to}.
            </CardDescription>
          </CardHeader>
            <SeatSelection />
        </Card>
      </main>
    </div>
  );
}
