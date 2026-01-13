/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useChangePasswordMutation } from "@/redux/service/auth/authApi";
import type React from "react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ChangePassword() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation
    if (!passwords.current.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Current password is required",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (!passwords.new.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "New password is required",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "New password and confirm password do not match",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (passwords.new.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Password must be at least 6 characters long",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const payload = {
        oldPassword: passwords.current,
        newPassword: passwords.new,
      };

      const res = await changePassword(payload).unwrap();

      if (res.status === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.message || "Password changed successfully.",
          confirmButtonColor: "#AF6900",
          timer: 2000,
          showConfirmButton: false,
        });
        setPasswords({
          current: "",
          new: "",
          confirm: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.message || "Failed to change password.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error: any) {
      const errorMessage = 
        error?.data?.message || 
        error?.message || 
        "An unexpected error occurred while changing password";
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-[#482817] md:text-3xl text-2xl font-extrabold font-abhaya mb-6">
        Change Password
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="currentPassword" 
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="currentPassword"
              value={passwords.current}
              onChange={(e) => handleInputChange("current", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="newPassword" 
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="newPassword"
              value={passwords.new}
              onChange={(e) => handleInputChange("new", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="confirmPassword" 
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              value={passwords.confirm}
              onChange={(e) => handleInputChange("confirm", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#AF6900] hover:bg-[#482817] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}