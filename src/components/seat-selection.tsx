"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Check, IndianRupee } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { updateBooking } from '@/store/slices/bookingSlice';
import { generateSeats, seatPricing } from "@/lib/plane-config";
import type { Seat as SeatData } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PlaneNose = () => (
  <div className="relative h-20 w-full">
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-muted rounded-t-full" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-10 bg-gray-300 rounded-t-full flex items-center justify-center text-xs text-gray-600">
      COCKPIT
    </div>
  </div>
);

const PlaneTail = () => (
  <div className="relative h-20 w-full mt-4">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-20 bg-muted rounded-b-full" />
  </div>
);

const PlaneWing = ({ side }: { side: 'left' | 'right' }) => (
  <div className={cn("absolute top-1/2 -translate-y-1/2 w-12 h-64 bg-muted/80 z-0", side === 'left' ? "left-0 rounded-l-2xl" : "right-0 rounded-r-2xl")}
    style={side === 'left' ? { clipPath: 'polygon(100% 0, 0 20%, 0 80%, 100% 100%)' } : { clipPath: 'polygon(0 0, 100% 20%, 100% 80%, 0 100%)' }}
  />
);

export function SeatSelection() {
  const router = useRouter();
  const booking = useSelector((state: RootState) => state.booking.currentBooking);
  const dispatch = useDispatch<AppDispatch>();

  const seats = useMemo<(SeatData | null)[][]>(() => generateSeats(), []);
  const [selectedPassengerId, setSelectedPassengerId] = useState<number | null>(() => booking?.passengers?.[0]?.id ?? null);
  
  const handleSeatClick = (seat: SeatData) => {
    if (seat.isOccupied) return;

    if (!selectedPassengerId) {
      toast.error("Please select a passenger first.");
      return;
    }

    if (!booking) return;

    const passengerIndex = booking.passengers.findIndex(p => p.id === selectedPassengerId);
    if (passengerIndex === -1) return;

    const newPassengers = [...booking.passengers];
    const currentPassenger = { ...newPassengers[passengerIndex] };
    
    // Check if another passenger has this seat
    const seatAlreadyTakenByOther = newPassengers.some(p => p.seat?.id === seat.id && p.id !== currentPassenger.id);
    if (seatAlreadyTakenByOther) {
        toast.error("Seat already selected by another passenger.");
        return;
    }

    // Deselect if it's the current passenger's seat
    if (currentPassenger.seat?.id === seat.id) {
      currentPassenger.seat = null;
    } else { // Select the new seat
      currentPassenger.seat = seat;
    }
    
    newPassengers[passengerIndex] = currentPassenger;
    dispatch(updateBooking({ passengers: newPassengers }));
  };

  const handleConfirmSeats = () => {
    const allPassengersHaveSeats = booking?.passengers.every(p => !!p.seat);
    if (!allPassengersHaveSeats) {
      toast.error("Seat required", { description: "Please select a seat for every passenger." });
      return;
    }
    router.push("/payment");
  };

  const getSeatStatus = (seat: SeatData) => {
    if (seat.isOccupied) return 'occupied';
    const passengerWithThisSeat = booking?.passengers.find(p => p.seat?.id === seat.id);
    if (passengerWithThisSeat) {
      return passengerWithThisSeat.id === selectedPassengerId ? 'selected' : 'taken';
    }
    return 'available';
  };

  const totalSeatCost = booking?.passengers.reduce((acc, p) => acc + (p.seat?.price || 0), 0) || 0;

  if (!booking) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="w-full bg-card p-4 rounded-lg shadow-md overflow-x-auto">
          <div className="relative inline-block px-12 mx-auto">
            <div className="absolute top-0 left-0 right-0 h-full w-full rounded-3xl border-2 border-muted" style={{top: "20px", height: "calc(100% - 40px)"}}/>
            <PlaneNose />
            <div className="relative z-10">
              <PlaneWing side="left"/>
              <PlaneWing side="right"/>
              <div className="px-8 space-y-2">
                {seats.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center justify-center gap-1 sm:gap-2">
                    <div className="w-4 text-center text-xs text-muted-foreground">{rowIndex + 1}</div>
                    {row.map((seat, seatIndex) => {
                      if (!seat) return <div key={seatIndex} className="w-6 h-6 sm:w-8 sm:h-8" />;
                      
                      const status = getSeatStatus(seat);
                      
                      return (
                        <button key={seat.id} onClick={() => handleSeatClick(seat)} disabled={status === 'occupied'}
                          className={cn(
                            "w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition-colors duration-200 text-white",
                            status === 'available' && `bg-primary/20 text-primary hover:bg-primary/40`,
                            seat.type === 'exit' && status === 'available' && `bg-green-500/20 text-green-600 hover:bg-green-500/40`,
                            status === 'selected' && 'bg-accent text-accent-foreground',
                            status === 'taken' && 'bg-primary/60 text-primary-foreground',
                            status === 'occupied' && 'bg-muted-foreground/30 cursor-not-allowed'
                          )}
                        >
                          {status === 'occupied' ? <X className="w-4 h-4"/> : 
                           status === 'selected' ? <Check className="w-4 h-4"/> : 
                           <span className="text-xs font-mono">{seat.id.slice(-1)}</span>
                          }
                        </button>
                      );
                    })}
                     <div className="w-4 text-center text-xs text-muted-foreground">{rowIndex + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            <PlaneTail />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground justify-center">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-primary/20 border border-primary"></div> Available</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-500/20 border border-green-600"></div> Exit Row</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-accent"></div> Selected</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-muted-foreground/30"></div> Occupied</div>
        </div>
      </div>
      
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Your Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Passengers</h3>
            {booking.passengers.map((p) => (
              <Button key={p.id} variant={selectedPassengerId === p.id ? 'secondary' : 'ghost'} className="w-full justify-between" onClick={() => setSelectedPassengerId(p.id)}>
                {p.name}
                <span className={cn("text-sm", p.seat ? "text-primary font-semibold" : "text-muted-foreground")}>
                    {p.seat ? `${p.seat.id} (+₹${p.seat.price})` : "Select seat"}
                </span>
              </Button>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold">Seat Prices</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {Object.entries(seatPricing).map(([type, price]) => (
                <li key={type} className="flex justify-between">
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  <span><IndianRupee size={12} className="inline-block -mt-1"/>{price}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Seat Total:</span>
            <span><IndianRupee size={16} className="inline-block -mt-1"/>{totalSeatCost.toLocaleString()}</span>
          </div>
          <Button size="lg" onClick={handleConfirmSeats} className="cursor-pointer">Confirm Seats & Proceed</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
