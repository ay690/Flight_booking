/* eslint-disable react-hooks/purity */
import type { BookingData, Passenger } from "@/types";
import { Plane, Barcode } from "lucide-react";
import { format } from "date-fns";

interface TicketProps {
  booking: BookingData;
  passenger: Passenger;
}

export default function Ticket({ booking, passenger }: TicketProps) {
  const flightNumber = booking.flightDetails?.id ?? `SR${Math.floor(100 + Math.random() * 900)}`;
  const gate = `${String.fromCharCode(65 + Math.floor(Math.random() * 10))}${Math.floor(1 + Math.random() * 15)}`;
  const boardingTime = booking.flightDetails ? (parseInt(booking.flightDetails.departure.split(':')[0]) - 1).toString().padStart(2, '0') + ':' + booking.flightDetails.departure.split(':')[1] : '18:30';
  const pnr = `SKY${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden flex">
      {/* Main ticket part */}
      <div className="p-4 grow flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-primary">
            <Plane />
            <span className="font-bold text-lg">SkyRoute</span>
          </div>
          <p className="font-semibold text-xs">BOARDING PASS</p>
        </div>

        <div className="grow">
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
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">{format(new Date(booking.departureDate), "MMMM dd, yyyy")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">PNR</p>
              <p className="font-mono font-medium">{pnr}</p>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-4">
            <p><strong>Note:</strong> Please be at the gate 30 minutes before boarding. Have a pleasant flight!</p>
        </div>
        <div className="border-t border-dashed border-muted-foreground/30 mt-4 pt-2 grid grid-cols-3 gap-4 text-sm text-center">
          <div>
            <p className="text-xs text-muted-foreground">Flight</p>
            <p className="font-bold">{flightNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Departs</p>
            <p className="font-bold">{booking.flightDetails?.departure}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Boarding</p>
            <p className="font-bold">{boardingTime}</p>
          </div>
        </div>
      </div>

      {/* Stub part */}
      <div className="bg-primary text-primary-foreground md:w-32 flex flex-col items-center justify-around p-4 border-l border-dashed border-muted-foreground/30">
        <div className="text-center">
          <p className="text-xs font-bold tracking-wider">SEAT</p>
          <p className="text-3xl font-bold">{passenger.seat?.id}</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold tracking-wider">GATE</p>
          <p className="text-3xl font-bold">{gate}</p>
        </div>
        <Barcode className="h-12 w-full" />
      </div>
    </div>
  );
}
