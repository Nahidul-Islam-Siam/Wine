/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import { logout } from "@/redux/features/auth";
import { useGetMeQuery } from "@/redux/service/auth/authApi";
import Image from "next/image";

interface AdminHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  colorBgContainer: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  open,
  setOpen,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { data: userData, isLoading } = useGetMeQuery();
  const user = userData?.data?.user;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header
      style={{
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
      }}
    >
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <MenuOutlined
          onClick={() => setOpen(!open)}
          className="text-2xl cursor-pointer text-gray-700"
        />
      </div>

      {/* Welcome Text */}
      <div className="hidden lg:flex items-center flex-1">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
          Welcome back{user?.name ? `, ${user.name}` : ""}!
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Add Product */}
        <Link
          href="/dashboard/all-product/add-product"
          className="bg-[#AF6900] hover:bg-[#8d7c68] text-white px-4 py-2 rounded-[14px] text-sm font-medium flex items-center space-x-1 transition-colors"
        >
          <span>+</span>
          <span>Add Product</span>
        </Link>

        {/* Notification */}
        {/* <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M10.2676 21C10.4431 21.304 10.6956 21.5565 10.9996 21.732C11.3037 21.9075 11.6485 21.9999 11.9996 21.9999C12.3506 21.9999 12.6955 21.9075 12.9995 21.732C13.3036 21.5565 13.556 21.304 13.7316 21"
              stroke="#8A8A83"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.26225 15.326C3.13161 15.4692 3.0454 15.6472 3.0141 15.8385C2.9828 16.0298 3.00777 16.226 3.08595 16.4034C3.16414 16.5807 3.29218 16.7316 3.4545 16.8375C3.61682 16.9434 3.80642 16.9999 4.00025 17H20.0002C20.194 17.0001 20.3837 16.9438 20.5461 16.8381C20.7085 16.7324 20.8367 16.5817 20.9151 16.4045C20.9935 16.2273 21.0187 16.0311 20.9877 15.8398C20.9566 15.6485 20.8707 15.4703 20.7402 15.327C19.4102 13.956 18.0002 12.499 18.0002 8C18.0002 6.4087 17.3681 4.88258 16.2429 3.75736C15.1177 2.63214 13.5915 2 12.0002 2C10.4089 2 8.88282 2.63214 7.75761 3.75736C6.63239 4.88258 6.00025 6.4087 6.00025 8C6.00025 12.499 4.58925 13.956 3.26225 15.326Z"
              stroke="#8A8A83"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </div> */}

        {/* Profile */}
        <div className="relative">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">
                {isLoading ? "Loading..." : user?.name || "User"}
              </div>
              <div className="text-xs text-gray-500">
                {user?.role || "Admin"}
              </div>
            </div>

            {user?.photo ? (
              <Image
                width={40}
                height={40}
                src="/images/avatar3.png"
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                {getInitials(user?.name)}
              </div>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="py-1 text-sm text-gray-700">
                {/* <li>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                </li> */}
                <li>
                  <div
                    className="block px-4 py-2 text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Click Outside Overlay */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default AdminHeader;
