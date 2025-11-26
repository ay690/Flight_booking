/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BookingData, BookingDetails } from '@/types';

interface BookingState {
  bookings: BookingData[];
  currentBooking: BookingData | null;
}

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

      state.currentBooking = {
        ...payload,
        departureDate: isDate(payload.departureDate)
          ? payload.departureDate.toISOString()
          : payload.departureDate,
        returnDate: isDate(payload.returnDate)
          ? payload.returnDate.toISOString()
          : payload.returnDate,
        passengers,
        bags: 0,
      };
    },

    updateBooking: (state, action: PayloadAction<Partial<BookingData>>) => {
      if (state.currentBooking) {
        const payload = action.payload;
        const updatedBooking = { ...state.currentBooking, ...payload };

        if (payload.departureDate && isDate(payload.departureDate)) {
          updatedBooking.departureDate = payload.departureDate.toISOString();
        }
        if (payload.returnDate && isDate(payload.returnDate)) {
          updatedBooking.returnDate = payload.returnDate.toISOString();
        }

        state.currentBooking = updatedBooking;
      }
    },

    confirmBooking: (state) => {
      if (state.currentBooking) {
        state.bookings.push(state.currentBooking);
        state.currentBooking = null;
      }
    },
  },
});

export const { setBooking, updateBooking, confirmBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
