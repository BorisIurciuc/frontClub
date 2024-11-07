import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { format, isValid, parseISO } from 'date-fns';

const dateString = "2024-11-07 11:40:58.452597"; 
const formattedDate = format(parseISO(dateString), "dd.MM.yyyy HH:mm:ss");

console.log(formattedDate);

export interface INews {
  createdAt: string | number | Date;
  id: number;
  title: string;
  description: string;
  created_by: string;
  created_at?: string | number | Date;
}

interface ErrorResponse {
  message: string;
}

interface DecodedToken {
  exp: number;
}

const decodeToken = <T>(token: string): T => {
  return jwtDecode<T>(token);
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// Action to create news
export const createNews = createAsyncThunk<INews, Partial<INews>>(
  "news/createNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        throw new Error("Authorization token is either missing or expired");
      }

      const response = await axios.post<INews>("/api/news", newsData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to create news");
    }
  }
);

// Action to delete news
export const deleteNews = createAsyncThunk<number, number>(
  "news/deleteNews",
  async (newsId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        throw new Error("Authorization token is either missing or expired");
      }

      await axios.delete(`/api/news/${newsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return newsId;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error deleting news:", axiosError);
      return rejectWithValue(axiosError.response?.data?.message || "Failed to delete news");
    }
  }
);

// Action to update news
export const updateNews = createAsyncThunk<INews, INews>(
  "news/updateNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const { id } = newsData;
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        throw new Error("Authorization token is either missing or expired");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put<INews>(`/api/news/${id}`, newsData, config);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 403) {
        console.error("Access denied: Permission to update this news item is forbidden.");
        return rejectWithValue("Access denied: Permission to update this news item is forbidden.");
      } else {
        console.error("An error occurred while updating the news:", axiosError);
        return rejectWithValue(axiosError.response?.data?.message || "Failed to update news");
      }
    }
  }
);

// Action to fetch all news
export const fetchNews = createAsyncThunk<INews[], void>(
  "news/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        throw new Error("Authorization token is either missing or expired");
      }

      const response = await axios.get<INews[]>("/api/news", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error fetching news:", axiosError);
      const errorMessage = axiosError.response?.data?.message || "Failed to fetch news";
      return rejectWithValue(errorMessage);
    }
  }
);

// Action to fetch news by ID with date formatting
export const getNewsById = createAsyncThunk<INews, number>(
  "news/getNewsById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        throw new Error("Authorization token is either missing or expired");
      }

      const response = await axios.get<INews>(`/api/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const news = response.data;

      // Format `createdAt` only if it's a valid ISO string
      const formattedNews = {
        ...news,
        createdAt:
          typeof news.createdAt === "string" && isValid(parseISO(news.createdAt))
            ? format(parseISO(news.createdAt), "dd.MM.yyyy HH:mm:ss")
            : news.createdAt?.toString() || "Unknown Date", // Convert to string if not ISO
      };

      return formattedNews;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error fetching news by ID:", axiosError);
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch news by ID");
    }
  }
);