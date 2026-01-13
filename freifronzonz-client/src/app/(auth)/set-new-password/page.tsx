"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo/logo.png";


const SetNewPasword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-normal flex items-center justify-center text-[#4E4E4A] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-lg p-10 shadow-sm">
        {/* Logo/Brand */}
     <div className="flex justify-center mb-6">
          <Image src={logo} alt="Logo" width={100} height={100} />
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-normal mb-2">Set new password</h2>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Password Field */}
          <div>
            <label className="block text-xs md:text-base text-[#6B7280] mb-3">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 text-[#848484] placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors rounded-[14px] border border-[#E5E5E5]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs md:text-base text-[#6B7280] mb-3">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-10 py-2.5 text-[#848484] placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors rounded-[14px] border border-[#E5E5E5]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#A7997D] text-white rounded-[16px] hover:bg-[#9a8c75] transition-all duration-200 border border-[#E5E5E5]"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetNewPasword;
