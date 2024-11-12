import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { format, isValid, parseISO } from "date-fns";

export interface INews {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string | number | Date;
  username: string;
}

interface ErrorResponse {
  message: string;
}

interface DecodedToken {
  exp?: number;
}

// Token expiration check
const checkTokenExpiry = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? decoded.exp < currentTime : true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// Token refresh handler
const refreshTokenIfNeeded = async (token: string, refreshToken: string): Promise<string | null> => {
  if (!checkTokenExpiry(token)) return token;

  try {
    const response = await axios.post("/api/auth/refresh", { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem("token", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

// Authenticated request helper
const requestWithAuth = async (
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: unknown
) => {
  let token = localStorage.getItem("token") || "";
  const refreshToken = localStorage.getItem("refreshToken") || "";
  
  token = await refreshTokenIfNeeded(token, refreshToken) || "";
  if (!token) {
    throw new Error("Authorization token is missing or could not be refreshed");
  }

  const response = await axios({
    method,
    url,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  return response.data;
};

// Async thunks
export const createNews = createAsyncThunk<INews, Partial<INews>>(
  "news/createNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const response = await requestWithAuth('post', "/api/news", newsData);
      return {
        ...response,
        createdAt: formatNewsDate(response.createdAt)
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to create news");
    }
  }
);

export const updateNews = createAsyncThunk<INews, { id: number; title: string; description: string }>(
  "news/updateNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const response = await requestWithAuth('put', `/api/news/${newsData.id}`, newsData);
      return {
        ...response,
        createdAt: formatNewsDate(response.createdAt)
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to update news");
    }
  }
);

export const deleteNews = createAsyncThunk<number, number>(
  "news/deleteNews",
  async (newsId, { rejectWithValue }) => {
    try {
      await requestWithAuth('delete', `/api/news/${newsId}`);
      return newsId;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to delete news");
    }
  }
);

export const fetchNews = createAsyncThunk<INews[], void>(
  "news/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await requestWithAuth('get', "/api/news");
      return response.map((news: INews) => ({
        ...news,
        createdAt: formatNewsDate(news.createdAt)
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch news");
    }
  }
);

export const getNewsById = createAsyncThunk<INews, number>(
  "news/getNewsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await requestWithAuth('get', `/api/news/${id}`);
      return {
        ...response,
        createdAt: formatNewsDate(response.createdAt)
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch news by ID");
    }
  }
);

// Helper function to format dates consistently
const formatNewsDate = (date: string | number | Date): string => {
  if (typeof date === "string" && isValid(parseISO(date))) {
    return format(parseISO(date), "dd.MM.yyyy HH:mm:ss");
  }
  if (date instanceof Date) {
    return format(date, "dd.MM.yyyy HH:mm:ss");
  }
  return "Unknown Date";
};
