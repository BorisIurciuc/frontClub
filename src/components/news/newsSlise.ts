import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { fetchNews, updateNews, deleteNews, INews } from './newsActions';

// Определение типа для состояния новостей
interface NewsState {
  news: INews[];
  isLoading: boolean;
  error: string | null | undefined;
}

// Инициализация начального состояния
const initialState: NewsState = {
  news: [],
  isLoading: false,
  error: null,
};

// Создание slice
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<INews[]>) => {
        state.isLoading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.error as SerializedError).message || "Failed to fetch news";
      })
      .addCase(updateNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action: PayloadAction<INews>) => {
        state.isLoading = false;
        const index = state.news.findIndex(news => news.id === action.payload.id);
        if (index !== -1) {
          state.news[index] = action.payload; // Обновляем новость
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.error as SerializedError).message || "Failed to update news";
      })
      .addCase(deleteNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        // Удаляем новость из состояния по ID
        state.news = state.news.filter(news => news.id !== action.payload);
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.error as SerializedError).message || "Failed to delete news";
      });
  },
});

// Экспортируем редуктор
export default newsSlice.reducer;
