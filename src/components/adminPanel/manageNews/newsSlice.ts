import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchNews, updateNews, deleteNews, createNews, INews } from './newsActions';
import { format, parseISO, isValid } from "date-fns";

interface NewsState {
  news: INews[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  news: [],
  isLoading: false,
  error: null,
};

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
        state.news = action.payload.map((news) => {
          const createdAtFormatted =
            typeof news.createdAt === "string" && isValid(parseISO(news.createdAt))
              ? format(parseISO(news.createdAt), "dd.MM.yyyy HH:mm:ss")
              : "Unknown Date";

          return {
            ...news,
            createdAt: createdAtFormatted,
          };
        });
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch news";
      })
      .addCase(createNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action: PayloadAction<INews>) => {
        state.isLoading = false;

        const createdAtFormatted =
          typeof action.payload.createdAt === "string" && isValid(parseISO(action.payload.createdAt))
            ? format(parseISO(action.payload.createdAt), "dd.MM.yyyy HH:mm:ss")
            : "Unknown Date";

        // Add the newly created news item at the top of the list
        state.news.unshift({
          ...action.payload,
          createdAt: createdAtFormatted,
        });
      })
      .addCase(createNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to create news";
      })
      .addCase(updateNews.fulfilled, (state, action: PayloadAction<INews>) => {
        const index = state.news.findIndex((news) => news.id === action.payload.id);
        if (index !== -1) {
          const updatedCreatedAt =
            typeof action.payload.createdAt === "string" && isValid(parseISO(action.payload.createdAt))
              ? format(parseISO(action.payload.createdAt), "dd.MM.yyyy HH:mm:ss")
              : "Unknown Date";

          state.news[index] = {
            ...action.payload,
            createdAt: updatedCreatedAt,
          };
        }
      })
      .addCase(deleteNews.fulfilled, (state, action: PayloadAction<number>) => {
        state.news = state.news.filter((news) => news.id !== action.payload);
      });
  },
});

export default newsSlice.reducer;
