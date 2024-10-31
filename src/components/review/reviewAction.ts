import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface AddReviewData {
  title: string;
  description: string;
  created_byI: number;
}

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (sendReviewData: AddReviewData, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Пользователь неавторизован");
    }

    try {
      console.log('Review data before sending:', sendReviewData); // Для отладки

      const response = await axios.post("/api/reviews", 
        {
          title: sendReviewData.title,
          description: sendReviewData.description,
          created_byI: sendReviewData.created_byI // Убедимся что передаем это поле
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Server response:', response.data); // Для отладки
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Server error:', axiosError.response?.data); // Для отладки
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || axiosError.message
      );
    }
  }
);

export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/reviews");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || axiosError.message
      );
    }
  }
);