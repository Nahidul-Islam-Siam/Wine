"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth"; // Adjust path if needed
import { useRouter } from "next/navigation";
import { useGetCartListQuery } from "@/redux/service/admin/cartApi";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const role = useSelector((state: RootState) => state?.auth.user?.role);
  // ✅ Add this line
  const { data: cartData } = useGetCartListQuery();

  const cartCount = cartData?.data.summary.totalItems || 0;
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileMenuOpen(false);
    router.push("/"); // Redirect to home after logout
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Events", href: "/events" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Contacts", href: "/contacts" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#FDF8EB] border-b border-gray-200 sm:block font-roboto">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-xs sm:text-sm text-gray-600">
          <div className="flex gap-4 sm:gap-6">
            <Link
              href="tel:+1234567890"
              className="flex items-center gap-1 text-[#968F8F] text-xs hover:text-gray-900"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M11.3748 12.8333C11.6069 12.8333 11.8295 12.7411 11.9936 12.5771C12.1576 12.413 12.2498 12.1904 12.2498 11.9583V9.91667C12.2498 9.6846 12.1576 9.46204 11.9936 9.29795C11.8295 9.13385 11.6069 9.04167 11.3748 9.04167C10.6923 9.04167 10.0215 8.93667 9.37984 8.72083C9.22643 8.67241 9.06268 8.66693 8.90637 8.70497C8.75007 8.74302 8.60716 8.82315 8.49317 8.93667L7.65317 9.77667C6.20198 8.98474 5.00926 7.79203 4.21734 6.34083L5.0515 5.50667C5.29067 5.27917 5.37817 4.94083 5.27317 4.61417C5.06317 3.97833 4.95817 3.3075 4.95817 2.625C4.95817 2.39294 4.86598 2.17038 4.70189 2.00628C4.53779 1.84219 4.31523 1.75 4.08317 1.75H2.0415C1.80944 1.75 1.58688 1.84219 1.42279 2.00628C1.25869 2.17038 1.1665 2.39294 1.1665 2.625C1.1665 8.25417 5.74567 12.8333 11.3748 12.8333ZM2.0415 2.33333H4.08317C4.16053 2.33333 4.23471 2.36406 4.28941 2.41876C4.34411 2.47346 4.37484 2.54765 4.37484 2.625C4.37484 3.37167 4.4915 4.10083 4.719 4.795C4.74817 4.87667 4.74234 4.99333 4.649 5.08667L3.49984 6.23C4.46234 8.11417 5.874 9.52583 7.764 10.5L8.9015 9.35083C8.98317 9.26917 9.094 9.24583 9.199 9.275C9.899 9.50833 10.6282 9.625 11.3748 9.625C11.4522 9.625 11.5264 9.65573 11.5811 9.71043C11.6358 9.76513 11.6665 9.83931 11.6665 9.91667V11.9583C11.6665 12.0357 11.6358 12.1099 11.5811 12.1646C11.5264 12.2193 11.4522 12.25 11.3748 12.25C6.0665 12.25 1.74984 7.93333 1.74984 2.625C1.74984 2.54765 1.78057 2.47346 1.83526 2.41876C1.88996 2.36406 1.96415 2.33333 2.0415 2.33333Z"
                    fill="#6D0E0B"
                  />
                </svg>
              </span>{" "}
              +1 (234) 567890
            </Link>
            <Link
              href="mailto:support@winemail.com"
              className="flex items-center gap-1 text-[#968F8F] text-xs hover:text-gray-900"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M11.9998 4H3.99984C3.26346 4 2.6665 4.59695 2.6665 5.33333V10.6667C2.6665 11.403 3.26346 12 3.99984 12H11.9998C12.7362 12 13.3332 11.403 13.3332 10.6667V5.33333C13.3332 4.59695 12.7362 4 11.9998 4Z"
                    stroke="#6D0E0B"
                  />
                  <path
                    d="M2.6665 6L7.40384 8.36867C7.5889 8.46115 7.79295 8.50929 7.99984 8.50929C8.20672 8.50929 8.41077 8.46115 8.59584 8.36867L13.3332 6"
                    stroke="#6D0E0B"
                  />
                </svg>
              </span>{" "}
              support@winemail.com
            </Link>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage("English")}
              className={`${
                language === "English"
                  ? "text-[#AF6900] font-semibold"
                  : "text-gray-600"
              } hover:text-gray-900`}
            >
              English
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setLanguage("Italian")}
              className={`${
                language === "Italian"
                  ? "text-gray-900 font-semibold"
                  : "text-gray-600"
              } hover:text-gray-900`}
            >
              Italian
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={logo}
                alt="Ops.wine Logo"
                width={150}
                height={50}
                priority
              />
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 mx-8">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 text-[#968F8F] text-sm focus:outline-none rounded-[20px] border-[0.5px] border-[#9E845C]"
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm md:text-base font-medium text-gray-700 font-poppins hover:text-amber-700 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4 ml-auto lg:ml-6">
              <div className="flex items-center gap-2">
                {/* Cart (always visible) */}
                <Link href="/cart">
                  <button
                    className="relative w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={`Shopping cart, ${cartCount} items`}
                  >
                    <ShoppingCart
                      className={`w-5 h-5 ${
                        cartCount > 0 ? "text-amber-700" : "text-gray-700"
                      }`}
                    />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-fadeIn">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </Link>

                {/* ✅ Auth UI with Dropdown */}
                {accessToken ? (
                  <>
                    {/* Wishlist */}
                    {/* <Link href="/wishlist">
                      <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full">
                        <Heart className="w-5 h-5 text-gray-700" />
                      </button>
                    </Link> */}

                    {/* Profile Dropdown Trigger */}
                    <div className="relative" ref={profileMenuRef}>
                      <button
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full"
                        aria-haspopup="true"
                        aria-expanded={profileMenuOpen}
                      >
                        <User className="w-5 h-5 text-gray-700" />
                      </button>

                      {/* Dropdown Menu */}
                      {profileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                          <div className="py-1">
                            <Link
                              href={
                                role === "ADMIN" ? "/dashboard" : "/profile"
                              }
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              {role === "ADMIN" ? "Dashboard" : "Profile"}
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Guest: Login / Sign Up */}
                    <Link href="/login">
                      <button className="text-sm border border-amber-700 px-4 py-2 font-medium text-gray-700 hover:text-amber-700 transition-colors">
                        Login
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="text-sm border border-amber-700 px-4 py-2 font-medium text-gray-700 hover:text-amber-700 transition-colors">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-full"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-amber-700"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-amber-700 py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
