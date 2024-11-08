import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode"; 

export interface INews {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
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
      
      console.log("Update request failed:", axiosError.toJSON()); 
      
      if (axiosError.response?.status === 403) {
        console.error("Access denied: Permission to update this news item is forbidden.");
        return rejectWithValue("Access denied: Permission to update this news item is forbidden.");
      } else {
        const errorMessage = axiosError.response?.data?.message || "Failed to update news";
        console.error("An error occurred while updating the news:", errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  }
);


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

      const formattedNews = response.data.map(news => ({
        ...news,
        createdAt: news.createdAt ? format(new Date(news.createdAt), 'dd.MM.yyyy HH:mm:ss') : "Invalid Date",
      }));

      return formattedNews;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error fetching news:", axiosError);
      const errorMessage = axiosError.response?.data?.message || "Failed to fetch news";
      return rejectWithValue(errorMessage);
    }
  }
);

// Action to fetch news by ID
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

      const formattedNews = {
        ...response.data,
        createdAt: response.data.createdAt ? format(new Date(response.data.createdAt), 'dd.MM.yyyy HH:mm:ss') : "Invalid Date",
      };

      return formattedNews;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error fetching news by ID:", axiosError);
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch news by ID");
    }
  }
);
