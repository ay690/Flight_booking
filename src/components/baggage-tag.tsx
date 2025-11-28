/* eslint-disable react-hooks/purity */
import type { BookingData, Passenger } from "@/types";
import { Plane, Barcode } from "lucide-react";

interface BaggageTagProps {
  booking: BookingData;
  passenger: Passenger;
  tagNumber: number;
}

export default function BaggageTag({ booking, passenger, tagNumber }: BaggageTagProps) {
  const trackingId = `SRBG${Math.floor(100000 + Math.random() * 900000)}`;
  const pnr = `SKY${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden flex">
      <div className="p-4 grow">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-3xl">{booking.to}</p>
            <p className="text-sm text-muted-foreground">Destination</p>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Plane className="h-5 w-5" />
            <span className="font-bold">SkyRoute</span>
          </div>
        </div>
        <div className="mt-4 border-t border-dashed pt-2 grid grid-cols-2 gap-4">
            <div>
                <p className="text-xs text-muted-foreground">Passenger</p>
                <p className="font-medium">{passenger.name}</p>
            </div>
             <div>
                <p className="text-xs text-muted-foreground">PNR</p>
                <p className="font-mono font-medium">{pnr}</p>
            </div>
        </div>
       <div className="text-xs text-muted-foreground mt-2">
            <p><strong>Note:</strong> This is not the airline luggage liability limit.</p>
        </div>
      </div>
      <div className="bg-muted/50 w-24 flex flex-col items-center justify-center p-2 border-l">
        <Barcode className="h-12 w-full text-foreground/80" />
        <p className="text-xs font-mono tracking-tighter mt-1">{trackingId}</p>
         <p className="text-xs font-medium text-muted-foreground mt-2">{tagNumber} of {booking.bags}</p>
      </div>
    </div>
  );
}
