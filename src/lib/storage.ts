import type { BookingData } from '@/types';

const AUTH_STORAGE_KEY = 'flight_booking_auth';
const BOOKING_STORAGE_KEY = 'flight_booking_state';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
  } | null;
}

export interface BookingStorageState {
  currentBooking: BookingData | null;
  bookings: BookingData[];
}

export const loadAuthState = (): AuthState | undefined => {
  try {
    const serializedState = localStorage.getItem(AUTH_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Failed to load auth state from localStorage', err);
    return undefined;
  }
};

export const saveAuthState = (state: AuthState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(AUTH_STORAGE_KEY, serializedState);
  } catch (err) {
    console.warn('Failed to save auth state to localStorage', err);
  }
};

export const loadBookingState = (): BookingStorageState | undefined => {
  try {
    const serializedState = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Failed to load booking state from localStorage', err);
    return undefined;
  }
};

export const saveBookingState = (state: BookingStorageState) => {
  try {
    const serializedState = JSON.stringify({
      currentBooking: state.currentBooking,
      bookings: state.bookings
    });
    localStorage.setItem(BOOKING_STORAGE_KEY, serializedState);
  } catch (err) {
    console.warn('Failed to save booking state to localStorage', err);
  }
};

export const clearAuthState = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear auth state from localStorage', err);
  }
};

export const clearBookingState = () => {
  try {
    localStorage.removeItem(BOOKING_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear booking state from localStorage', err);
  }
};
