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
)