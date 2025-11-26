import type { BookingData, Passenger } from "@/types";
import { Plane, Barcode } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface TicketProps {
  booking: BookingData;
  passenger: Passenger;
}

export default function Ticket({ booking, passenger }: TicketProps) {
  const [autoFlightNumber] = useState(() => `SR${Math.floor(100 + Math.random() * 900)}`);
  const flightNumber = booking.flightDetails?.id ?? autoFlightNumber;
  const [autoGate] = useState(() => {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 10));
    const number = Math.floor(1 + Math.random() * 15);
    return `${letter}${number}`;
  });
  const gate = autoGate;
  const boardingTime = booking.flightDetails ? (parseInt(booking.flightDetails.departure.split(':')[0]) - 1).toString().padStart(2, '0') + ':' + booking.flightDetails.departure.split(':')[1] : '18:30';

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
      <div className="p-6 grow">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-primary">
            <Plane />
            <span className="font-bold text-lg">SkyRoute</span>
          </div>
          <p className="font-semibold text-sm">Boarding Pass</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-bold text-2xl">{booking.from}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">To</p>
            <p className="font-bold text-2xl">{booking.to}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Passenger</p>
            <p className="font-medium truncate">{passenger.name}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="font-medium">{format(new Date(booking.departureDate), "MMMM dd, yyyy")}</p>
          </div>
        </div>
      </div>
      <div className="bg-primary/10 md:w-32 flex flex-row md:flex-col items-center justify-around p-4 border-t md:border-t-0 md:border-l border-dashed border-muted-foreground/30">
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Flight</p>
            <p className="font-bold">{flightNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gate</p>
            <p className="font-bold">{gate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Seat</p>
            <p className="font-bold">{passenger.seat?.id}</p>
          </div>
           <div>
            <p className="text-xs text-muted-foreground">Boarding</p>
            <p className="font-bold">{boardingTime}</p>
          </div>
        </div>
        <Barcode className="h-16 w-16 md:h-12 md:w-full text-primary/80" />
      </div>
    </div>
  );
}