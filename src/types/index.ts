export interface FlightDetails {
  id: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
}

export interface BookingDetails {
  from: string;
  to: string;
  departureDate: Date | string;
  returnDate?: Date | string;
  tripType: 'one-way' | 'round-trip';
  passengers: number;
}

export type SeatType = 'window' | 'middle' | 'aisle' | 'exit';

export interface Seat {
  id: string; // e.g., "1A", "12F"
  type: SeatType;
  isOccupied: boolean;
  price: number;
}

export interface Passenger {
  id: number;
  name: string;
  seat: Seat | null;
}

export interface BookingData extends Omit<BookingDetails, 'passengers' | 'departureDate' | 'returnDate'> {
  departureDate: string;
  returnDate?: string;
  passengers: Passenger[];
  bags: number;
  flightDetails?: FlightDetails;
  bookingDate?: string;
}
