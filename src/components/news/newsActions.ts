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

// Создание новости
export const createNews = createAsyncThunk<INews, INews>(
  "news/createNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<INews>("/api/news", newsData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create news");
    }
  }
);

// Удаление новости
export const deleteNews = createAsyncThunk<INews, number>(
  "news/deleteNews",
  async (_newsId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete<INews>(`/api/news/{id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete news");
    }
  }
);

// Обновление новости
export const updateNews = createAsyncThunk<INews, INews>(
  "news/updateNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put<INews>(`/api/news/{id}`, newsData, {
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
// Получение новости по ID
export const getNewsById = createAsyncThunk<INews, number>(
  "/api/news/{id}",
  async (_newsId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<INews>(`/api/news/{id}`, {
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



// Получение всех новостей с токеном авторизации
export const fetchNews = createAsyncThunk<INews[], void>(
  "news/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      // Получение токена из localStorage
      const token = localStorage.getItem("token");

      // Выполнение запроса на получение новостей с передачей токена в заголовке
      const response = await axios.get<INews[]>("/api/news", {
        headers: {
          Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        },
      });

      return response.data; // Возвращаем данные ответа (массив новостей)
    } catch (error: any) {
      // Обработка ошибки и передача сообщения об ошибке через rejectWithValue
      return rejectWithValue(error.response?.data?.message || "Failed to fetch news");
    }
  }
);

