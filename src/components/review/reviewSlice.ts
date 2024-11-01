import { createSlice } from "@reduxjs/toolkit";
import { addReview, getReviews } from "./reviewAction";
import { IReviewData } from "./types/reviewData";

interface IReviewState {
    reviews: IReviewData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: IReviewState = {
    reviews: [],
    isLoading: false,
    error: null,
};

const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReviews.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.isLoading = false;
            })
            .addCase(getReviews.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            .addCase(addReview.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.isLoading = false;
            })
            .addCase(addReview.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
    },	
});

export default reviewSlice;
// export const {} = reviewSlice.actions;