"use client";

import { useSelector } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { RootState } from '@/store/store';
import { useDispatch } from 'react-redux';
import { removeBooking } from '@/store/slices/bookingSlice';
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Plane, Calendar, Users, Luggage } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function BookingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const bookings = useSelector((state: RootState) => state.booking.bookings);

  const handleCancelBooking = (index: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      dispatch(removeBooking(index));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-200">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">My Bookings</h1>
            <p className="mt-2 text-lg text-muted-foreground">View your past and upcoming trips.</p>
          </div>

          {bookings?.length > 0 ? (
            <div className="space-y-6">
              {bookings?.map((b, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Plane className="h-6 w-6 text-primary"/>
                                {b.from} to {b.to}
                            </CardTitle>
                            <CardDescription>
                                {b.tripType === 'one-way' ? 'One Way' : 'Round Trip'}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                className='cursor-pointer hover:bg-destructive hover:text-destructive-foreground'
                                onClick={() => handleCancelBooking(index)}
                            >
                                Cancel
                            </Button>
                            <Link href="/confirmation">
                                <Button className='cursor-pointer'>View Details</Button>
                            </Link>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-3 gap-4">
                     <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Departure</p>
                            <p className="text-sm text-muted-foreground">{b.departureDate ? format(new Date(b.departureDate), "PPP") : ''}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Passengers</p>
                            <p className="text-sm text-muted-foreground">{b.passengers.length}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Luggage className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Bags</p>
                            <p className="text-sm text-muted-foreground">{b.bags}</p>
                        </div>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                <Ticket className="h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
                <p className="text-muted-foreground mb-4">You haven&apos;t booked any flights with us yet.</p>
                <Link href="/">
                    <Button className='cursor-pointer'>Book a Flight</Button>
                </Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
