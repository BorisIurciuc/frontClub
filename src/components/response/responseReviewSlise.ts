import { createSlice } from "@reduxjs/toolkit";
import { addResponse, deleteResponse, getResponse } from "./responseReviewAction";
import { IResponseData } from "./types/responseRevData";

interface IResponseState {
    responses: { [reviewId: number]: IResponseData[] }; // Store responses by reviewId
    isLoading: boolean;
    error: string | null;
}

const initialState: IResponseState = {
    responses: {},  // Initialize as an empty object
    isLoading: false,
    error: null,
};

const responseRevSlice = createSlice({
    name: "responses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getResponse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getResponse.fulfilled, (state, action) => {
                const { reviewId, data } = action.payload; // Destructure reviewId and data
                state.responses[reviewId] = data; // Store responses under the specific reviewId
                state.isLoading = false;
            })
            .addCase(getResponse.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            .addCase(addResponse.fulfilled, (state, action) => {
                state.responses[action.payload.reviewId] = action.payload.data;
                // state.responses = [...state.responses, action.payload];
                state.isLoading = false;
            })
            .addCase(addResponse.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            .addCase(addResponse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteResponse.fulfilled, (state, action) => {
                const { reviewId, data } = action.payload; // Destructure reviewId and data
                state.responses[reviewId] = data; // Store responses under the specific reviewId
                state.isLoading = false;
                // state.responses = state.responses.filter((response) => {
                //     return response.id !== action.payload.id; 
                // )}
            })
            .addCase(deleteResponse.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            .addCase(deleteResponse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            });
    },
});

export default responseRevSlice;