import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { getUserWithToken, loginUser } from "./authAction";

export interface IUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  active: boolean;
}

export interface ITokenDto {
  refreshToken: string;
  accessToken: string;
}

export interface IUserData {
  id: number;
  username: string;
  email: string;
  roles?: string[]; 
  active?: boolean; 
}


interface IUserState {
  user: IUser | null;
  isLoading: boolean;
  error: string | SerializedError | null;
  isAuthenticated: boolean;
}

const initialState: IUserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, _: PayloadAction<ITokenDto>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = {
          ...state.user,
          id: 0,
          username: "",
          email: "",
          roles: [],
          active: true,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.error; 
        state.isAuthenticated = false;
      })
      .addCase(getUserWithToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserWithToken.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserWithToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.error; 
        state.isAuthenticated = false;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
