import axios, { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IResponseData } from "./types/responseRevData";

export const getResponse = createAsyncThunk(
  "responses/getResponse",
  async (reviewId: number, thunkAPI) => {
    try {
      const response = await axios.get(`/api/responses/review/${reviewId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || axiosError.message
      );
    }
  }
);
