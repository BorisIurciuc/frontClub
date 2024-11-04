import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchNews, updateNews, deleteNews, createNews, INews } from './newsActions';

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
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Failed to fetch news";
      })
      .addCase(createNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action: PayloadAction<INews>) => {
        state.isLoading = false;
        state.news.unshift(action.payload); // Adding the newly created news to the top
      })
      .addCase(createNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Failed to create news";
      })
      // Other cases for updateNews, deleteNews
      .addCase(updateNews.fulfilled, (state, action: PayloadAction<INews>) => {
        const index = state.news.findIndex((news) => news.id === action.payload.id);
        if (index !== -1) state.news[index] = action.payload;
      })
      .addCase(deleteNews.fulfilled, (state, action: PayloadAction<number>) => {
        state.news = state.news.filter((news) => news.id !== action.payload);
      });
  },
});

export default newsSlice.reducer;