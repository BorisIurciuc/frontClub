import { createSlice } from "@reduxjs/toolkit";
import { getActivities, addActivity } from "./reduxActivitiesAction";
import { IActivity } from "./types";

interface ActivityState {
  activities: IActivity[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  isLoading: false,
  error: null,
};

const reduxActivitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    cleanActivities: (state) => {
      state.activities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActivities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
        state.isLoading = false;
      })
      .addCase(getActivities.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(addActivity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addActivity.fulfilled, (state, action) => {
        state.activities.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addActivity.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export const { cleanActivities } = reduxActivitiesSlice.actions;
export default reduxActivitiesSlice.reducer;
