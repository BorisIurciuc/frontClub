import { createSlice } from "@reduxjs/toolkit";
import { addReview, deleteReview, editReview, getReviews } from "./reviewAction";
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
                state.reviews = [...state.reviews, action.payload];
                state.isLoading = false;
            })
            .addCase(addReview.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            .addCase(editReview.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editReview.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            .addCase(editReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.map((review) => {
                    if (review.id === action.payload.id) {
                        return action.payload;
                    }
                    return review;
                });
                state.isLoading = false;
            })
            .addCase(deleteReview.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter((review) => {
                    return review.id !== action.payload.id; 
                })
            })
            .addDefaultCase((state) => {
                state.isLoading = false;
                state.error = null;
            });
        }
    });
export default reviewSlice;
// export const {} = reviewSlice.actions;
