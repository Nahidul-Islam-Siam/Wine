/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/logo.png";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        {/* Left Side - Reset Password Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8">
          <div className="max-w-md w-full">
            {/* Back to Login Link */}
            <Link
              href="/login"
              className="flex items-center text-xs text-[#771A09] font-normal md:text-lg mb-4 hover:text-[#A7997D]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M15.75 18.75L9 12L15.75 5.25"
                  stroke="#313131"
                  stroke-width="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to login
            </Link>

            <h2 className="text-3xl md:text-4xl font-abhaya font-extrabold text-gray-800 mb-2">
              Set a password
            </h2>
            <p className="text-[#968F8F] text-sm mb-6">
              Your previous password has been reset. Please set a new password for your account.
            </p>

            <form className="space-y-5">
              {/* Create Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="7789BM6X@H&$K_"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm text-[#636364] placeholder:text-sm placeholder:text-[#636364]
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

              {/* Re-enter Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Re-enter Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="7789BM6X@H&$K_"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm text-[#636364] placeholder:text-sm placeholder:text-[#636364]
                      rounded-[6px] border border-black/25 bg-[rgba(196,196,196,0)]
                      shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] focus:outline-none focus:ring-1 focus:ring-[#A7997D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Set Password Button */}
              <button
                type="submit"
                className="w-full py-2.5 text-white md:text-[20px] text-lg 
                  hover:bg-[#8d6a3f] transition-colors duration-200 font-medium 
                  rounded-[6px] bg-[#AF6900] shadow-[0_4px_10px_0_rgba(233,68,75,0.25)]"
              >
                Set Password
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Reset Password Illustration */}
        <div className="hidden md:block w-1/2 p-14">
          <div
            className="h-full w-full rounded-lg shadow-lg bg-cover bg-center"
            style={{
              backgroundImage: "url('/f1.png')", // ← Use this image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;