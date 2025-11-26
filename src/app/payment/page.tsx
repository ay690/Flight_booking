"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { IndianRupee, CreditCard, Calendar, Lock, User, Loader2, Luggage, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { updateBooking, confirmBooking } from '@/store/slices/bookingSlice';

const BAGGAGE_PRICE_PER_UNIT = 800;

export default function PaymentPage() {
  const booking = useSelector((state: RootState) => state.booking.currentBooking);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [bagCount, setBagCount] = useState(booking?.bags || 0);

  useEffect(() => {
    if (!booking) {
      router.replace("/");
    } else if (!booking.flightDetails) {
      router.replace("/flights/search");
    } else if (!booking.passengers.every(p => !!p.seat)) {
      router.replace("/select-seat");
    }
  }, [booking, router]);

  const handleBagsChange = (amount: number) => {
    const newBagCount = Math.max(0, bagCount + amount);
    setBagCount(newBagCount);
    dispatch(updateBooking({ bags: newBagCount }));
  };

  const handlePayment = () => {
    setIsProcessing(true);
    toast("Processing Payment...", {
      description: "Please wait while we confirm your booking.",
    });

    // Simulating payment processing
    setTimeout(() => {
      setIsProcessing(false);
      dispatch(confirmBooking());
      toast.success("Booking Confirmed!", {
        description: "You can check your bookings in 'My Bookings'.",
      });
      router.push("/confirmation");
    }, 2000);
  };

  if (!booking) {
    return null;
  }

  const flightPrice = booking.flightDetails?.price || 0;
  const totalFlightCost = flightPrice * booking.passengers.length;
  const totalSeatCost = booking.passengers.reduce((acc, p) => acc + (p.seat?.price || 0), 0);
  const totalBaggageCost = bagCount * BAGGAGE_PRICE_PER_UNIT;
  const grandTotal = totalFlightCost + totalSeatCost + totalBaggageCost;


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Complete Your Booking</CardTitle>
              <CardDescription>Add baggage and enter payment details to confirm your flight.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <h3 className="font-semibold text-lg">Booking Summary</h3>
                    <div className="flex justify-between text-sm"><span>Flights ({booking.passengers.length} passengers)</span> <span><IndianRupee size={12} className="inline-block -mt-1"/>{totalFlightCost.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span>Seat Selection</span> <span><IndianRupee size={12} className="inline-block -mt-1"/>{totalSeatCost.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span>Extra Baggage ({bagCount} bags)</span> <span><IndianRupee size={12} className="inline-block -mt-1"/>{totalBaggageCost.toLocaleString()}</span></div>
                    <Separator/>
                    <div className="flex justify-between font-bold text-lg"><span>Total Amount Due</span> <span><IndianRupee size={16} className="inline-block -mt-1"/>{grandTotal.toLocaleString()}</span></div>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label className="text-base font-semibold">Extra Baggage</Label>
                        <div className="flex items-center gap-4 mt-2 p-3 border rounded-lg">
                           <Luggage className="h-6 w-6 text-primary"/>
                           <div className="grow">
                             <p className="font-medium">Add checked bags</p>
                             <p className="text-sm text-muted-foreground">
                              (<span className="inline-flex items-center gap-1 whitespace-nowrap">+<IndianRupee size={12} className="inline-block -mt-0.5" />{BAGGAGE_PRICE_PER_UNIT}</span> per bag)
                            </p>
                           </div>
                           <div className="flex items-center gap-2">
                             <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleBagsChange(-1)} disabled={bagCount <= 0}><Minus className="h-4 w-4"/></Button>
                             <span className="font-bold text-lg w-5 text-center">{bagCount}</span>
                             <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleBagsChange(1)}><Plus className="h-4 w-4"/></Button>
                           </div>
                        </div>
                    </div>

                     <Separator/>

                     <div>
                         <Label className="text-base font-semibold">Payment Details</Label>
                        <div className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label htmlFor="card-name">Name on Card</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="card-name" placeholder="John Doe" className="pl-10" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="card-number">Card Number</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="card-number" placeholder="0000 0000 0000 0000" className="pl-10" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                     <Label htmlFor="expiry">Expiry Date</Label>
                                    <div className="relative">
                                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                       <Input id="expiry" placeholder="MM/YY" className="pl-10"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvv">CVV</Label>
                                    <div className="relative">
                                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                       <Input id="cvv" placeholder="123" className="pl-10"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full cursor-pointer" size="lg" onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Pay <IndianRupee size={16} className="inline-block -mt-1 ml-1.5"/>{grandTotal.toLocaleString()}
                </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
