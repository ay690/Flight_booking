'use client';

import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { removeBooking } from '@/store/slices/bookingSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Plane, Calendar, Users, Luggage } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function BookingsContent() {
  const bookings = useSelector((state: RootState) => state.booking.bookings);
  const dispatch = useDispatch<AppDispatch>();

  const handleCancelBooking = (index: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      dispatch(removeBooking(index));
    }
  };

  if (bookings.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
        <Ticket className="h-12 w-12 text-muted-foreground mb-4"/>
        <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
        <p className="text-muted-foreground mb-4">You haven&apos;t booked any flights with us yet.</p>
        <Link href="/">
          <Button className='cursor-pointer'>Book a Flight</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((b, index) => (
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
  );
}
