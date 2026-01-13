/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/logo.png";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "@/redux/service/auth/authApi";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

import Cookies from "js-cookie";
import { setUser } from "@/redux/features/auth";

// Utility to decode JWT
const decodeToken = (token: string): { exp: number; iat: number } | null => {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return {
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginUserMutation();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please enter both email and password.",
      confirmButtonColor: "#AF6900",
    });
    return;
  }

  try {
    const result = await login({ email, password }).unwrap();

    if (result.status === true) {
      // ✅ Destructure ALL needed fields directly from result.data
      const { id, email: userEmail, role, token, refreshToken } = result.data;

      const decoded = decodeToken(token);
      if (!decoded) {
        throw new Error("Invalid access token received.");
      }

      // ✅ Build authUser using actual fields
      const authUser = {
        userId: id,
        email: userEmail,
        role,
        exp: decoded.exp,
        iat: decoded.iat,
      };

      // ✅ Save to Redux
      dispatch(setUser({ user: authUser, accessToken: token, refreshToken }));

      // ✅ Save to cookies
      Cookies.set("accessToken", token, { expires: 7 });
      Cookies.set("refreshToken", refreshToken, { expires: 7 });

      if (rememberMe) {
        Cookies.set("rememberMe", "true", { expires: 30 });
      } else {
        Cookies.remove("rememberMe");
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back!",
        confirmButtonColor: "#AF6900",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1600);
    } else {
      throw new Error(result.message || "Login failed");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    const message =
      error?.data?.message ||
      error?.message ||
      "Invalid email or password. please try again.";
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: message,
      confirmButtonColor: "#d33",
    });
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with Logo */}
      <header className="text-center py-8">
        <Link href="/">
          <Image
            src={logo}
            alt="Ops.wine Logo"
            width={150}
            height={60}
            className="mx-auto"
          />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex flex-1">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8">
          <div className="max-w-md w-full">
            <h2 className="text-3xl md:text-4xl font-abhaya font-extrabold text-gray-800 mb-1">
              Welcome back
            </h2>
            <p className="text-[#968F8F] text-sm md:text-lg mb-6">
              Welcome back! Please enter your details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm text-[#636364] placeholder:text-sm placeholder:text-[#636364] 
                      rounded-[6px] border border-black/25 bg-[rgba(196,196,196,0)] 
                      shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] focus:outline-none focus:ring-1 focus:ring-[#A7997D]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="**********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm text-[#636364] placeholder:text-sm font-normal placeholder:text-[#636364]  
                      rounded-[6px] border border-black/25 bg-[rgba(196,196,196,0)] 
                      shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] focus:outline-none focus:ring-1 focus:ring-[#A7997D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3 h-3 border border-gray-300 rounded accent-[#A7997D] cursor-pointer mr-1"
                  />
                  <span className="text-[#482817] text-xs">Remember me</span>
                </label>
                <Link
                  href="/forget-password"
                  className="text-[#9E845C] hover:text-[#A7997D] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 text-white md:text-[20px] text-lg font-medium rounded-[6px] shadow-[0_4px_10px_0_rgba(233,68,75,0.25)] transition-colors duration-200 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#AF6900] hover:bg-[#8d6a3f]"
                }`}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-4 text-xs text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#AF6900] hover:text-[#8d7c68] font-medium"
              >
                Sign up for free!
              </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-xs text-gray-500">Or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login Icons */}
            <div className="flex justify-center space-x-6">
              <Link href="#" className="text-xl text-gray-700 hover:text-red-500">
                <FcGoogle />
              </Link>
              {/* <Link href="#" className="text-xl text-gray-700 hover:text-blue-600">
                <FaFacebook />
              </Link>
              <Link href="#" className="text-xl text-gray-700 hover:text-pink-500">
                <BsInstagram />
              </Link> */}
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-1/2 p-14">
          <div
            className="h-full w-full bg-cover bg-center rounded-lg shadow-lg"
            style={{
              backgroundImage: "url('/login1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default LoginForm;