import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllUsers, deleteUser, getUser } from "./adminActions";
import { IUser } from "../features/auth/authSlice"; // Предположим, что IUser уже определен в authSlice

// Интерфейс для состояния admin
interface AdminState {
  users: IUser[];
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: AdminState = {
  users: [],
  user: null,
  loading: false,
  error: null,
};

// Создание slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<IUser[]>) {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Обрабатываем асинхронные действия для fetchAllUsers
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch users.";
        state.loading = false;
      })

      // Обрабатываем асинхронные действия для deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete user.";
        state.loading = false;
      })

      // // Обрабатываем асинхронные действия для updateUser
      // .addCase(updateUser.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(updateUser.fulfilled, (state, action: PayloadAction<IUser>) => {
      //   state.users = state.users.map((user) =>
      //     user.id === action.payload.id ? action.payload : user
      //   );
      //   state.loading = false;
      // })
      // .addCase(updateUser.rejected, (state, action) => {
      //   state.error = action.error.message || "Failed to update user.";
      //   state.loading = false;
      // })

      // Обрабатываем асинхронные действия для getUser
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch user.";
        state.loading = false;
      })
  },
});

// Экспортируем асинхронные действия
// Экспортируем редьюсер
export const { setUsers } = adminSlice.actions;
export default adminSlice.reducer;
