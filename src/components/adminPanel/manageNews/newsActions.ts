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

const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
  try {
    const response = await axios.post('/api/auth/refresh', { refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    console.log("Using refresh token to fetch new access token:", refreshToken);
    return null;
  }
};

const getValidAccessToken = async (accessToken: string, refreshToken: string): Promise<string> => {
  if (isTokenExpired(accessToken)) {
    const newAccessToken = await refreshAccessToken(refreshToken);
    if (newAccessToken) {
      console.log("Access token refreshed successfully.");
      return newAccessToken;
    } else {
      throw new Error("Unable to refresh access token");
    }
  }
  return accessToken;
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

      console.log("Attempting to create news with token:", token);
      console.log("Sending request to create news with payload:", newsData);

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

// Action to delete news
export const deleteNews = createAsyncThunk<number, number>(
  "news/deleteNews",
  async (newsId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        throw new Error("Authorization token is either missing or expired");
      }

      console.log("Attempting to delete news with token:", token);
      console.log("Sending request to delete news with ID:", newsId);

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

// Utility function to check if user has required role
const hasRequiredRole = (token: string, requiredRole: string): boolean => {
  try {
    const decoded = decodeToken<DecodedToken & { roles: { role: string }[] }>(token);
    return decoded.roles.some(role => role.role === requiredRole);
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

// Action to update news
export const updateNews = createAsyncThunk<INews, INews>(
  "news/updateNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const { id } = newsData;
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      console.log("Retrieved token:", token);
      console.log("Retrieved refresh token:", refreshToken);

      // Check if both tokens are available
      if (!token || !refreshToken) {
        console.error("Authorization tokens are missing.");
        return rejectWithValue("Authorization token or refresh token is missing");
      }

      // Get valid access token (handles expired token and refresh)
      const validAccessToken = await getValidAccessToken(token, refreshToken); 

      // Check if the user has the required role
      if (!hasRequiredRole(validAccessToken, "ROLE_ADMIN")) {
        throw new Error("User does not have the required role to update news");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${validAccessToken}`, // Use the valid access token
        },
      };

      console.log("Attempting update with token:", validAccessToken);
      console.log("Sending request to update news with payload:", newsData);
      console.log("Headers:", config.headers);

      // Make the update request using the valid token
      const response = await axios.put<INews>(`/api/news/${id}`, newsData, config);

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Check if we got a 403 Forbidden error
      if (axiosError.response?.status === 403) {
        console.error("Access denied: Permission to update this news item is forbidden.");
        return rejectWithValue("Access denied: Permission to update this news item is forbidden.");
      } else {
        // Log the error details and return a fallback error message
        console.error("An error occurred while updating the news:", axiosError);
        return rejectWithValue(
          axiosError.response?.data?.message || "Failed to update news"
        );
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

      console.log("Attempting to fetch all news with token:", token);

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

      console.log("Attempting to fetch news by ID with token:", token);
      console.log("Sending request to fetch news by ID:", id);

      const response = await axios.get<INews>(`/api/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const news = response.data;

      const formattedNews = {
        ...news,
        createdAt:
          typeof news.createdAt === "string" && isValid(parseISO(news.createdAt))
            ? format(parseISO(news.createdAt), "dd.MM.yyyy HH:mm:ss")
            : news.createdAt?.toString() || "Unknown Date",
      };

      console.log("Fetched news data:", formattedNews);

      return formattedNews;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error fetching news by ID:", axiosError);
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch news by ID");
    }
  }
);
