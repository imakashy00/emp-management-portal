
import { configureStore } from '@reduxjs/toolkit';
import appSlice from './userSlice';


const store = configureStore({
  reducer: {
    app: appSlice,
  },
});

export default store;

