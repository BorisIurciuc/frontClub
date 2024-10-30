import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export const getReviews = createAsyncThunk(
    "reviews",
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

export const addReview = createAsyncThunk(
    "reviews/addReview",
    async (reviewData: {title: string, description: string}, thunkAPI) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return thunkAPI.rejectWithValue("Пользователь неавторизован");
        }

        try {
            const response = await axios.post("/api/reviews", reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`,
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