// src/features/appSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null, // 'employee' | 'manager' | null
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Example: Set a logged-in user
    setUser(state, action) {
      state.user = action.payload?.user ?? null;
      state.role = action.payload?.role ?? null;
    },
    // Example: Clear user on logout
    clearUser(state) {
      state.user = null;
      state.role = null;
    },
    // Handy generic reducers you might use later
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload ?? null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setUser, clearUser, setStatus, setError, clearError } = appSlice.actions;

// Simple selectors (optional)
export const selectUser = (state) => state.app.user;
export const selectRole = (state) => state.app.role;
export const selectStatus = (state) => state.app.status;
export const selectError = (state) => state.app.error;

export default appSlice;