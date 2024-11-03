import { createSlice } from "@reduxjs/toolkit";
import { getResponse } from "./responseRevAction";
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
            .addCase(getResponse.fulfilled, (state, action) => {
                state.responses[action.payload.reviewId] = action.payload.data;
                // state.responses = [...state.responses, action.payload];
                state.isLoading = false;
            })
            .addCase(getResponse.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            .addCase(getResponse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            });
    },
});

export default responseRevSlice;