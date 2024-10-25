import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import authSlice from "../components/features/auth/authSlice";
import reduxActivitiesSlice from "../components/reduxActivities/reduxActivitiesSlice";
import adminReducer from '../components/adminPanel/adminSlice';
import newsReducer from "../components/news/newsSlise"



export const store = configureStore({
  reducer: {
    admin: adminReducer,
    reduxActivities: reduxActivitiesSlice,
    user: authSlice.reducer,
    news: newsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;