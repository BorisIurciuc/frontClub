/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ReactNode } from "react";

// Определите интерфейс для новостей
export interface INews {
  summary: ReactNode;
  url: string | undefined;
  id: number;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
}

// Действие для удаления новости по ID с токеном авторизации
export const deleteNews = createAsyncThunk<void, number>(
  "news/deleteNews",
  async (newsId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Получение токена из localStorage
      await axios.delete(`/api/news/${newsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return newsId; // Возвращаем ID удаленной новости
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete news");
    }
  }
);

// Действие для обновления новости
export const updateNews = createAsyncThunk<INews, INews>(
  "news/updateNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put<INews>(`/api/news/${newsData.id}`, newsData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update news");
    }
  }
);

// Действие для получения всех новостей с токеном авторизации
export const fetchNews = createAsyncThunk<INews[], void>(
  "news/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Получение токена из localStorage
      const response = await axios.get<INews[]>("/api/news", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch news");
    }
  }
);

// Действие для получения конкретной новости по ID с токеном авторизации
export const getNewsById = createAsyncThunk<INews, number>(
  "news/getNewsById",
  async (newsId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Получение токена из localStorage
      const response = await axios.get<INews>(`/api/news/${newsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch news by ID");
    }
  }
);
