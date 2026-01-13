/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";
import { logout, setAccessToken } from "../features/auth";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://freifronzonz-server-1.onrender.com/api/v1",
    baseUrl: "https://api.ops.wine/api/v1",
        // baseUrl: "http://localhost:4200/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.accessToken;
    if (token) {
      headers.set("token", token); // ✅ Raw token only — no "Bearer"
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // ✅ Check for 401 (Unauthorized)
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).accessToken;
      api.dispatch(setAccessToken(newAccessToken));
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "auth",
    "roofing",
    "window",
    "category",
    "brand",
    "product",
    "order",
    "user",
    "size",
    "event",
    "payment",
    "cart",
    "users",
    "cms",
    "stats"
    
  ],
  endpoints: () => ({}),
});

export default baseApi;
