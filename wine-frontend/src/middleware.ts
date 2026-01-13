/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

// Utility to decode JWT (safe for Edge Runtime)
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  // If no token → redirect to login
  if (!token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Decode token to get role
  const payload = decodeJwt(token);
  const role = payload?.role;

  // ✅ Only allow "ADMIN" to access /dashboard
  if (role !== "ADMIN") {
    // Optional: redirect to a "forbidden" page or home
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  // ✅ Admin with valid token → allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};