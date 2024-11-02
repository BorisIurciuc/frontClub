import { createSlice } from "@reduxjs/toolkit";
import { getResponse } from "./responseRevAction";
import { IResponseData } from "./types/responseRevData";

interface IResponseState {
    responses: IResponseData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: IResponseState = {
    responses: [],
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
                state.responses = action.payload;
                state.isLoading = false;
            })
            .addCase(getResponse.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            });
    },
});

export default responseRevSlice;