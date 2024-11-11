import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import authReducer from "../components/auth/features/authSlice";
import reduxActivitiesReducer from "../components/auth/reduxActivities/reduxActivitiesSlice";
import newsReducer from "../components/adminPanel/manageNews/newsSlice";
import adminReducer from '../components/adminPanel/manageUsers/userSlice';
import reviewSlice from "../components/review/reviewSlice";
import responseRevSlice from "../components/response/responseReviewSlise";
import manageActivitiesSlice from "../components/adminPanel/manageActivities/manageActivitiesSlice";

// Configure the store
export const store = configureStore({
  reducer: {
    reduxActivities: reduxActivitiesReducer,
    user: authReducer,
    admin: adminReducer,
    activity: manageActivitiesSlice,
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