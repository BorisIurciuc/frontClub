import axios, { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
// import { IResponseData } from "./types/responseRevData";

interface IAddResponseData {
    reviewId: number;
    content: string;
    created_byId: number;
}

export const addResponse = createAsyncThunk(
    "responses/addResponse",
    async (sendResponseData: IAddResponseData, thunkAPI) => {
        const token = localStorage.getItem("token");
        if (!token) {
          return thunkAPI.rejectWithValue("Пользователь неавторизован");
        }

      try {
        const response = await axios.post(`/api/responses/review/${sendResponseData.reviewId}`, 
            {
            content: sendResponseData.content,
            created_byId: sendResponseData.created_byId,
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

export const getResponse = createAsyncThunk(
    "responses/getResponse",
    async (reviewId: number, thunkAPI) => {
      try {
        const response = await axios.get(`/api/responses/review/${reviewId}`);
        return { reviewId, data: response.data }; // Return reviewId along with the response data
      } catch (error) {
        const axiosError = error as AxiosError;
        return thunkAPI.rejectWithValue(
          axiosError.response?.data || axiosError.message
        );
      }
    }
  );

export	const deleteResponse = createAsyncThunk(
    "responses/deleteResponse",
    async (responseId: number, thunkAPI) => {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue("Пользователь неавторизован");
      }
      try {
        const response = await axios.delete(`/api/responses/${responseId}`, {
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

