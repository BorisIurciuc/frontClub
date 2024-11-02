import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IResponseData } from "./types/responseRevData";

export const getResponse = createAsyncThunk(
    "responses/getResponse",
    async ({ reviewId }: { reviewId: IResponseData }) => {
        try {
            const response = await axios.get(
                `/api/responses/review/${reviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Failed to fetch responses:", error);
            throw error;
        }
    }
);