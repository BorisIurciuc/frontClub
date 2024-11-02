import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface AddReviewData {
  title: string;
  description: string;
  created_byId: number;
}

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (sendReviewData: AddReviewData, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Пользователь неавторизован");
    }

    try {
      const response = await axios.post("/api/reviews", 
        {
          title: sendReviewData.title,
          description: sendReviewData.description,
          created_byId: sendReviewData.created_byId // Fixed typo here
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
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

export const editReview = createAsyncThunk(
  "reviews/editReview",
  async (review: { reviewId: number; title: string; description: string }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Пользователь неавторизован");
    }
    
    try {
      const response = await axios.put(
        `/api/reviews/${review.reviewId}`,
        {
          title: review.title,
          description: review.description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || axiosError.message
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId: number, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Пользователь неавторизован");
    }
    try {
      const response = await axios.delete(`/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || axiosError.message
      );
    }
  }
);



