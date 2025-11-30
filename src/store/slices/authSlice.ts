import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Clear auth data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('flight_booking_auth');
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
