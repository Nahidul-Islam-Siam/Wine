/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/logo.png";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useRegisterUserMutation } from "@/redux/service/auth/authApi";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const router = useRouter();
  const [register, { isLoading }] = useRegisterUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all fields.",
        confirmButtonColor: "#AF6900",
      });
      return;
    }

    if (!agreeTerms) {
      Swal.fire({
        icon: "warning",
        title: "Terms Required",
        text: "Please accept the terms & policy to continue.",
        confirmButtonColor: "#AF6900",
      });
      return;
    }

    try {

      const payload = {
        name,
        email,
        password,
        // role: "ADMIN", // or remove if backend sets it automatically
      }
      const result = await register(payload).unwrap();

      // ✅ Success: Show SweetAlert and redirect
      if (result.status === true) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: result.message || "Welcome! You're now signed up.",
          confirmButtonColor: "#AF6900",
          timer: 2000,
          showConfirmButton: true,
        }).then(() => {
          router.push("/login"); // Redirect to login page
        });
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // ✅ Handle error from RTK Query
      const message =
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
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
        {/* Left Side - Registration Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8">
          <div className="max-w-md w-full">
            <h2 className="text-3xl md:text-4xl font-abhaya font-extrabold text-gray-800 mb-1">
              Get Started Now
            </h2>
            <p className="text-[#968F8F] text-sm md:text-lg mb-6">
              Create your account to start exploring.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-[#636364] placeholder:text-sm placeholder:text-[#636364]
                    rounded-[6px] border border-black/25 bg-[rgba(196,196,196,0)]
                    shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] focus:outline-none focus:ring-1 focus:ring-[#A7997D]"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="email"
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

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3 h-3 mt-1 border border-gray-300 rounded accent-[#A7997D] cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-[#482817] leading-tight"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="underline hover:text-[#A7997D]"
                  >
                    terms & policy
                  </Link>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 text-white md:text-[20px] text-lg 
                  transition-colors duration-200 font-medium 
                  rounded-[6px] shadow-[0_4px_10px_0_rgba(233,68,75,0.25)]
                  ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#AF6900] hover:bg-[#8d6a3f]"}
                `}
              >
                {isLoading ? "Signing Up..." : "Sign up"}
              </button>

              {/* Already have account? */}
              <div className="text-center text-xs text-gray-600 mt-4">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#AF6900] hover:text-[#8d7c68] font-medium"
                >
                  Login
                </Link>
              </div>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-xs text-gray-500">
                  Or login with
                </span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Social Login Icons */}
              <div className="flex justify-center space-x-6">
                <Link href="#" className="text-xl">
                  <FcGoogle />
                </Link>
                <Link href="#" className="text-xl">
                  <FaFacebook />
                </Link>
                <Link href="#" className="text-xl">
                  <BsInstagram />
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-1/2 p-14">
          <div
            className="h-full w-full rounded-lg shadow-lg bg-cover bg-center"
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

export default RegistrationForm;