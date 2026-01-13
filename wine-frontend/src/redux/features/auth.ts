import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  email: string;
  exp: number;
  iat: number;
  role: string;
  userId: string;
};

interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading?: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth", // Optional: rename from "user" to "auth"
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        user: UserType | null;
        accessToken: string | null;
        refreshToken: string | null;
      }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    logout(state) {
      // ✅ ONLY clear state — NO navigation here
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      
      // ✅ Clear auth cookies (adjust names if needed)
      document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      
      // ❌ REMOVE THIS:
      // window.location.href = "/";
    },
  },
});

export const {
  setUser,
  setAccessToken,
  setRefreshToken,
  setIsLoading,
  logout,
} = authSlice.actions;

export default authSlice.reducer;