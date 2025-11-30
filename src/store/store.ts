import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './slices/bookingSlice';
import authReducer from './slices/authSlice';
import { loadAuthState, saveAuthState, loadBookingState, saveBookingState } from '@/lib/storage';

// Load initial state from localStorage
const preloadedState = {
  auth: loadAuthState() || {
    isAuthenticated: false,
    user: null,
  },
  booking: loadBookingState() || {
    currentBooking: null,
    bookings: [],
  },
};

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      booking: bookingReducer,
      auth: authReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  // Subscribe to store changes and save states to localStorage
  store.subscribe(() => {
    const state = store.getState();
    saveAuthState(state.auth);
    saveBookingState({
      currentBooking: state.booking.currentBooking,
      bookings: state.booking.bookings,
    });
  });

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];