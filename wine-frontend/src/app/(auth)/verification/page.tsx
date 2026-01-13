/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/logo.png";

const VerificationPage = () => {
  const [code, setCode] = useState("");

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
        {/* Left Side - Verification Form */}
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
              Verify code
            </h2>
            <p className="text-[#968F8F] text-sm mb-6">
              An authentication code has been sent to your email.
            </p>

            <form className="space-y-5">
              {/* Code Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="7789BM6X"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-[#636364] placeholder:text-sm placeholder:text-[#636364]
                      rounded-[6px] border border-black/25 bg-[rgba(196,196,196,0)]
                      shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] focus:outline-none focus:ring-1 focus:ring-[#A7997D]"
                  />
                  {/* Optional: Show eye icon if you want to toggle visibility */}
                  {/* <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button> */}
                </div>
              </div>

              {/* Resend Link */}
              <div className="text-xs text-gray-600">
                Didn&apos;t receive a code?{" "}
                <Link
                  href="#"
                  className="text-[#AF6900] hover:text-[#8d7c68] font-medium"
                >
                  Resend
                </Link>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                className="w-full py-2.5 text-white md:text-[20px] text-lg 
                  hover:bg-[#8d6a3f] transition-colors duration-200 font-medium 
                  rounded-[6px] bg-[#AF6900] shadow-[0_4px_10px_0_rgba(233,68,75,0.25)]"
              >
                Verify
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Verification Illustration */}
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

export default VerificationPage;