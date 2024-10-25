import { createSlice } from "@reduxjs/toolkit";
import { getUserWithToken, loginUser } from "./authAction";

export interface IUserData {
  id: number;
  username: string;
  email: string;
  refreshToken: string;
  token: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  active: true;
}

export interface ITokenDto {
  [x: string]: string;
  refreshToken: string;
  accessToken: string;
}

interface IUserState {
  [x: string]: any;
  user: IUser|undefined;
  isLoading: boolean;
  error: string;
  isAuthenticated: boolean;
}

export interface ILoginFormValues {
  username: string;
  password: string;
}

export interface IRegisterFormValues {
  username: string;
  password: string;
  email: string;
}

const initialState: IUserState = {
  user: undefined,
  isLoading: false,
  error: "",
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = undefined;
      localStorage.removeItem("token");
      state.isAuthenticated = false;
      state.error = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = undefined;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(getUserWithToken.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getUserWithToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserWithToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = undefined;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice;
export const { logoutUser } = authSlice.actions;
