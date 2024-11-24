import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchNews, updateNews, deleteNews, createNews, INews } from './newsActions';
import { format, parseISO, isValid } from "date-fns";

interface NewsState {
  news: INews[];
  isLoading: boolean;
  error: string | null;
}

// Инициализация начального состояния
const initialState: NewsState = {
  news: [],
  isLoading: false,
  error: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState, // Здесь используется ранее объявленное initialState
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<INews[]>) => {
        state.isLoading = false;
        state.news = action.payload.map((news) => {
          const createdAtFormatted =
            typeof news.createdAt === "string" && isValid(parseISO(news.createdAt))
              ? format(parseISO(news.createdAt), "dd.MM.yyyy HH:mm:ss")
              : news.createdAt instanceof Date
              ? format(news.createdAt, "dd.MM.yyyy HH:mm:ss")
              : "Unknown Date";
          return {
            ...news,
            createdAt: createdAtFormatted,
          };
        });
      })
      .addCase(createNews.fulfilled, (state, action: PayloadAction<INews>) => {
        state.isLoading = false;
        const createdAtFormatted =
          typeof action.payload.createdAt === "string" && isValid(parseISO(action.payload.createdAt))
            ? format(parseISO(action.payload.createdAt), "dd.MM.yyyy HH:mm:ss")
            : action.payload.createdAt instanceof Date
            ? format(action.payload.createdAt, "dd.MM.yyyy HH:mm:ss")
            : "Unknown Date";
        
        state.news.unshift({
          ...action.payload,
          createdAt: createdAtFormatted,
        });
      })
      .addCase(updateNews.fulfilled, (state, action: PayloadAction<INews>) => {
        state.isLoading = false;
        const index = state.news.findIndex((news) => news.id === action.payload.id);
        if (index !== -1) {
          const updatedCreatedAt =
            typeof action.payload.createdAt === "string" && isValid(parseISO(action.payload.createdAt))
              ? format(parseISO(action.payload.createdAt), "dd.MM.yyyy HH:mm:ss")
              : action.payload.createdAt instanceof Date
              ? format(action.payload.createdAt, "dd.MM.yyyy HH:mm:ss")
              : "Unknown Date";
          
          state.news[index] = {
            ...action.payload,
            createdAt: updatedCreatedAt,
          };
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to update news";
      })
      .addCase(deleteNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.news = state.news.filter((news) => news.id !== action.payload);
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to delete news";
      })
      .addDefaultCase((state) => {
        state.isLoading = false;
        state.error = null;
      });
  },
});

export default newsSlice.reducer;
