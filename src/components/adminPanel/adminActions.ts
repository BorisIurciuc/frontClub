import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IUser } from "../features/auth/authSlice";


// Получение всех пользователей (доступно администратору)
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<IUser[]>("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const getUser = createAsyncThunk(
  "admin/getUser",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<IUser>(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

//Получение информации о конкретном пользователе по его ID
export const getUserById = createAsyncThunk(
  "admin/getUserById",
  async (_userId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<IUser>(`/api/users/{id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

// Удаление пользователя (доступно администратору)
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);


// // Обновление данных пользователя (доступно администратору или пользователю)
// export const updateUser = createAsyncThunk(
//   "admin/updateUser",
//   async ({ id, data }: { id: number; data: Partial<IUser> }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(`/api/users/{id}`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to update user");
//     }
//   }
// );