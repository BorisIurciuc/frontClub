import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllActivities, deleteActivity } from "./manageActivity/activityActions";

interface IActivity {
  id: number;
  title: string;
  address: string;
  startDate: string;
  image: string;
  description: string;
}

interface ActivityState {
  activities: IActivity[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllActivities.fulfilled, (state, action: PayloadAction<IActivity[]>) => {
        state.activities = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllActivities.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch activities.";
        state.loading = false;
      })
      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action: PayloadAction<number>) => {
        state.activities = state.activities.filter((activity) => activity.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete activity.";
        state.loading = false;
      });
  },
});

export default activitySlice.reducer;