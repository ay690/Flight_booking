/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BookingData, BookingDetails } from '@/types';

interface BookingState {
  bookings: BookingData[];
  currentBooking: BookingData | null;
}

const parseDate = (dateStr: string | Date | null): Date | null => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  return new Date(dateStr);
};

const parseBookingData = (data: any): BookingData | null => {
  if (!data) return null;
  return {
    ...data,
    departureDate: parseDate(data.departureDate),
    returnDate: data.returnDate ? parseDate(data.returnDate) : null,
    passengers: data.passengers || [],
    flightDetails: data.flightDetails || null,
  };
};

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
};

const isDate = (val: any): val is Date => val instanceof Date;

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBooking: (state, action: PayloadAction<BookingDetails>) => {
      const passengers = Array.from(
        { length: action.payload.passengers },
        (_, i) => ({
          id: i + 1,
          name: `Passenger ${i + 1}`,
          seat: null,
        })
      );

      const payload = action.payload;
      const departureDate = isDate(payload.departureDate) 
        ? payload.departureDate 
        : new Date(payload.departureDate);
      
      const returnDate = payload.returnDate 
        ? (isDate(payload.returnDate) 
            ? payload.returnDate 
            : new Date(payload.returnDate))
        : null;

      state.currentBooking = {
        ...payload,
        departureDate: departureDate.toISOString(),
        returnDate: returnDate?.toISOString(),
        passengers,
        bags: 0,
      };
    },

    updateBooking: (state, action: PayloadAction<Partial<BookingData>>) => {
      if (state.currentBooking) {
        const payload = action.payload;
        const updatedBooking = { ...state.currentBooking, ...payload };

        if (payload.departureDate) {
          updatedBooking.departureDate = isDate(payload.departureDate)
            ? payload.departureDate.toISOString()
            : payload.departureDate;
        }
        if (payload.returnDate !== undefined) {
          updatedBooking.returnDate = payload.returnDate !== null && payload.returnDate !== ''
            ? (isDate(payload.returnDate)
                ? payload.returnDate.toISOString()
                : String(payload.returnDate))
            : undefined;
        }

        state.currentBooking = updatedBooking;
      }
    },

    confirmBooking: (state) => {
      if (state.currentBooking) {
        state.bookings.push({
          ...state.currentBooking,
          bookingDate: new Date().toISOString()
        });
        state.currentBooking = null;
      }
    },
    rehydrateBooking: (state, action: PayloadAction<BookingState>) => {
      if (action.payload.currentBooking) {
        state.currentBooking = parseBookingData(action.payload.currentBooking);
      }
      if (action.payload.bookings) {
        state.bookings = action.payload.bookings.map(booking => 
          parseBookingData(booking) || booking
        );
      }
    },
    
    removeBooking: (state, action: PayloadAction<number>) => {
      state.bookings = state.bookings.filter((_, index) => index !== action.payload);
    },
  },
});

export const { setBooking, updateBooking, confirmBooking, rehydrateBooking, removeBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
