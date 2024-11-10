import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {jwtDecode } from "jwt-decode";
import { format, isValid, parseISO } from "date-fns";

export interface INews {
  createdAt: string | number | Date;
  id: number;
  title: string;
  description: string;
  created_by: string;
}

interface ErrorResponse {
  message: string;
}

interface DecodedToken {
  exp?: number;
}

// Decode JWT token
// const decodeToken = <T>(token: string): T => jwtDecode<T>(token);

// Check if the token is expired
const checkTokenExpiry = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token); // Decode the token
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? decoded.exp < currentTime: true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Treat token as expired on error
  }
};

// Refresh the token if expired and update localStorage
const refreshTokenIfNeeded = async (token: string, refreshToken: string): Promise<string | null> => {
  if (!checkTokenExpiry(token)) return token; // Return existing token if still valid

  try {
    const response = await axios.post("/api/auth/refresh", { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem("token", accessToken); // Update token in localStorage
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

// Action to create a news item
export const createNews = createAsyncThunk<INews, Partial<INews>>(
  "news/createNews",
  async (newsData, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("token") || "";
      const refreshToken = localStorage.getItem("refreshToken") || "";

      token = await refreshTokenIfNeeded(token, refreshToken) || "";
      if (!token) {
        return rejectWithValue("Authorization token is missing or could not be refreshed");
      }

      const response = await axios.post<INews>("/api/news", newsData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error creating news:", axiosError);
      return rejectWithValue(axiosError.response?.data?.message || "Failed to create news");
    }
  }
);

// Action to delete a news item by ID
export const deleteNews = createAsyncThunk<number, number>(
  "news/deleteNews",
  async (newsId, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("token") || "";
      const refreshToken = localStorage.getItem("refreshToken") || "";

      token = await refreshTokenIfNeeded(token, refreshToken) || "";
      if (!token) {
        return rejectWithValue("Authorization token is missing or could not be refreshed");
      }

      await axios.delete(`/api/news/${newsId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return newsId;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error deleting news:", axiosError);
      return rejectWithValue(axiosError.response?.data?.message || "Failed to delete news");
    }
  }
);

// Action to update a news item
export const updateNews = createAsyncThunk<INews, INews>(
  "news/updateNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const { id } = newsData;
      let token = localStorage.getItem("token") || "";
      const refreshToken = localStorage.getItem("refreshToken") || "";

      token = await refreshTokenIfNeeded(token, refreshToken) || "";
      if (!token) {
        return rejectWithValue("Authorization token is missing or could not be refreshed");
      }

      const response = await axios.put<INews>(`/api/news/${id}`, newsData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error updating news:", axiosError);
      return rejectWithValue(axiosError.response?.data?.message || "Failed to update news");
    }
  }
);

// Action to fetch all news items
export const fetchNews = createAsyncThunk<INews[], void>(
  "news/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("token") || "";
      const refreshToken = localStorage.getItem("refreshToken") || "";

      token = await refreshTokenIfNeeded(token, refreshToken) || "";
      if (!token) {
        return rejectWithValue("Authorization token is missing or could not be refreshed");
      }

      const response = await axios.get<INews[]>("/api/news", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error fetching news:", axiosError);
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch news");
    }
  }
);

// Action to fetch news by ID with date formatting
export const getNewsById = createAsyncThunk<INews, number>(
  "news/getNewsById",
  async (id, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("token") || "";
      const refreshToken = localStorage.getItem("refreshToken") || "";

      token = await refreshTokenIfNeeded(token, refreshToken) || "";
      if (!token) {
        return rejectWithValue("Authorization token is missing or could not be refreshed");
      }

      const response = await axios.get<INews>(`/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const news = response.data;

      // Format the createdAt field if it's a valid ISO date string
      const formattedNews = {
        ...news,
        createdAt:
          typeof news.createdAt === "string" && isValid(parseISO(news.createdAt))
            ? format(parseISO(news.createdAt), "dd.MM.yyyy HH:mm:ss")
            : news.createdAt?.toString() || "Unknown Date",
      };

      return formattedNews;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error fetching news by ID:", axiosError);
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch news by ID");
    }
  }
);
