import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import authSlice from "../components/auth/features/authSlice";
import reduxActivitiesSlice from "../components/auth/reduxActivities/reduxActivitiesSlice";
import reviewSlice from "../components/review/reviewSlice";
import responseRevSlice from "../components/response/responseReviewSlise";
import adminReducer from '../components/adminPanel/adminSlice';
import newsReducer from "../components/adminPanel/manageNews/newsSlice";

export const store = configureStore({
  reducer: {
    reduxActivities: reduxActivitiesSlice.reducer,
    user: authSlice.reducer,
    admin: adminReducer,
    reviews: reviewSlice.reducer,
    responseReview: responseRevSlice.reducer,
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
