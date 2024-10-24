import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchNews, INews } from './newsActions';

// Определение типа для состояния новостей
interface NewsState {
  news: INews[];        // Массив новостей
  articles: string[];   // Пример: массив статей (если есть другие статьи, помимо новостей)
  isLoading: boolean;   // Флаг загрузки
  loading: boolean;     // Еще один флаг загрузки для других действий
  error: string | null | unknown; // Поле для ошибок
}

// Инициализация начального состояния
const initialState: NewsState = {
  news: [],
  articles: [],
  isLoading: false,
  loading: false,
  error: null,
};

// Создание slice
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    fetchNewsStart(state) {
      state.loading = true;
    },
    fetchNewsSuccess(state, action: PayloadAction<string[]>) {
      state.loading = false;
      state.articles = action.payload;
    },
    fetchNewsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Асинхронные действия для fetchNews
      .addCase(fetchNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<INews[]>) => {
        state.isLoading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Экспортируем синхронные действия
export const { fetchNewsStart, fetchNewsSuccess, fetchNewsFailure } = newsSlice.actions;

// Экспортируем редуктор
export default newsSlice.reducer;
