"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { updateBooking } from '@/store/slices/bookingSlice';
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlaneTakeoff, PlaneLanding, IndianRupee } from "lucide-react";
import { format } from "date-fns";

// Dummy flights that would be fetched from an API in a real app
const availableFlights = [
  { id: 'SR101', departure: '08:00', arrival: '10:05', duration: '2h 5m', price: 5400 },
  { id: 'SR102', departure: '12:30', arrival: '14:45', duration: '2h 15m', price: 6200 },
  { id: 'SR103', departure: '18:45', arrival: '21:00', duration: '2h 15m', price: 4800 },
];

export default function FlightSearchPage() {
  const booking = useSelector((state: RootState) => state.booking.currentBooking);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    if (!booking) {
      router.replace("/");
    }
  }, [booking, router]);

  const handleSelectFlight = (flight: typeof availableFlights[number]) => {
    dispatch(updateBooking({ flightDetails: flight }));
    router.push("/select-seat");
  };

  if (!booking) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
                <div className="text-center">
                    <p>Loading booking details...</p>
                    <Button onClick={() => router.push("/")} className="mt-4">Go Back to Search</Button>
                </div>
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Select Your Outbound Flight</CardTitle>
                    <CardDescription>
                        Showing flights from {booking.from} to {booking.to} on {booking.departureDate ? format(new Date(booking.departureDate), "PPP") : ''}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {availableFlights?.map((flight) => (
                        <Card key={flight.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 grid grid-cols-5 items-center gap-4">
                                <div className="col-span-3 space-y-2">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <PlaneTakeoff className="h-5 w-5 text-primary" />
                                            <span className="font-bold text-lg">{flight.departure}</span>
                                        </div>
                                        <div className="text-muted-foreground text-sm border-t-2 border-dashed grow text-center pt-1">{flight.duration}</div>
                                        <div className="flex items-center gap-2">
                                            <PlaneLanding className="h-5 w-5 text-primary" />
                                            <span className="font-bold text-lg">{flight.arrival}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">SkyRoute {flight.id}</div>
                                </div>
                                <div className="col-span-2 text-right">
                                    <p className="text-xl font-bold flex items-center justify-end gap-1"><IndianRupee size={18}/>{flight.price.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">per passenger</p>
                                    <Button className="mt-2 cursor-pointer" onClick={() => handleSelectFlight(flight)}>Select Flight</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
