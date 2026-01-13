/* eslint-disable @typescript-eslint/no-explicit-any */
// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useGetCartListQuery } from "@/redux/service/admin/cartApi";
import CartItemsList from "../Cart/CartItemsList";
import {
  CreateOrderRequest,
  useCreateOrderMutation,
} from "@/redux/service/admin/orderApi";
import Swal from "sweetalert2";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartData, isLoading, refetch } = useGetCartListQuery();
  const [createOrder] = useCreateOrderMutation();

  const carts = cartData?.data?.carts || [];
  const summary = cartData?.data?.summary;

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle form submit
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);

  const firstName = (formData.get("firstName") || "").toString();
  const lastName = (formData.get("lastName") || "").toString();
  const email = (formData.get("email") || "").toString();
  const phone = (formData.get("phone") || "").toString();
  const address = (formData.get("address") || "").toString();

  // Basic validation
  if (!firstName.trim()) {
    setErrors({ ...errors, firstName: "First name is required" });
    return;
  }
  if (!address.trim()) {
    setErrors({ ...errors, address: "Address is required" });
    return;
  }

  const payload: CreateOrderRequest = {
    shippingDetails: {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      address,
    },
    paymentMethod: "CARD",
  };

  try {
    const res = await createOrder(payload).unwrap();

    if (res.status && res.data?.payment?.url) {
      // ✅ SUCCESS: Redirect to Stripe Checkout
      Swal.fire({
        icon: "success",
        title: "Redirecting to payment...",
        text: "Please complete your payment on Stripe.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      }).then(() => {
   window.open(res.data.payment.url, '_blank');

      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: res.message || "Failed to create order.",
        confirmButtonColor: "#d33",
      });
    }
  } catch (error: any) {
    console.error("Create order failed:", error);
    const errorMsg = error?.data?.message || error?.message || "An unexpected error occurred";
    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMsg,
      confirmButtonColor: "#d33",
    });
  }
};

  // ✅ Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && carts.length === 0) {
      router.push("/cart");
    }
  }, [carts.length, isLoading, router]);

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-bold text-[#482817] mb-6">
        Checkout
      </h1>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left: Cart Items (50%) */}
        <div className="lg:w-1/2 w-full">
          <CartItemsList
            carts={carts}
            refetchCart={refetch}
            showSummary={true}
          />
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-px bg-black my-12"></div>

        {/* Right: Checkout Form (50%) */}
        <div className="lg:w-1/2 w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg p-6">
              <h2 className="text-xl font-extrabold text-[#0B0B0B] md:text-3xl font-abhaya mb-4">
                Fill info
              </h2>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm md:text-base font-normal text-[#1f1f1f] mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 bg-[#F0F0F0] placeholder:text-gray-400 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.firstName
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#C77D2F]"
                    }`}
                    placeholder="Your Name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm md:text-base font-normal text-[#1f1f1f] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 bg-[#F0F0F0] placeholder:text-gray-400 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#C77D2F]"
                    }`}
                    placeholder="Your Name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-sm md:text-base font-normal text-[#1f1f1f] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 bg-[#F0F0F0] placeholder:text-gray-400 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#C77D2F]"
                  }`}
                  placeholder="Your Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="mb-4">
                <label className="block text-sm md:text-base font-normal text-[#1f1f1f] mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 bg-[#F0F0F0] placeholder:text-gray-400 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#C77D2F]"
                  }`}
                  placeholder="+880 1XXXXXXXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Address Field */}
              <div className="mb-6">
                <label className="block text-sm md:text-base font-normal text-[#1f1f1f] mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 bg-[#F0F0F0] placeholder:text-gray-400 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.address
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#C77D2F]"
                  }`}
                  placeholder="Your Address"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 mb-6">
                <h3 className="font-bold text-lg mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#1F1F1F]">Subtotal:</span>
                    <span className="font-bold">
                      ${summary?.subtotal?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  {summary && summary.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>
                        -${summary?.totalDiscount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#1F1F1F]">Shipping:</span>
                    <span className="font-bold">
                      ${summary?.totalShippingFee?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>
                      ${summary?.estimatedTotal?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#C77D2F] text-white font-bold py-4 px-4 rounded hover:bg-[#B06A28] transition-colors"
              >
                Submit Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
