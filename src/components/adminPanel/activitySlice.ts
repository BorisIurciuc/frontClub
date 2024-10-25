import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllActivities, deleteActivity } from "./activityActions";

// Интерфейс для описания активности
interface IActivity {
  id: number;
  title: string;
  address: string;
  startDate: string;
  image: string;
  description: string;
}

// Интерфейс для состояния активности
interface ActivityState {
  activities: IActivity[];
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
};

// Создание слайса для активностей
const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    // Если нужно добавить дополнительные синхронные действия, можно добавить их здесь
  },
  extraReducers: (builder) => {
    builder
      // Получение всех активностей
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

      // Удаление активности
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

// Экспорт редьюсера
export default activitySlice.reducer;
