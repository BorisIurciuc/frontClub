import axios from "axios";
import { IReviewData } from "../review/types/reviewData";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getResponse = createAsyncThunk(
    "responses/getResponse",
    async (reviewId: IReviewData) => {
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
