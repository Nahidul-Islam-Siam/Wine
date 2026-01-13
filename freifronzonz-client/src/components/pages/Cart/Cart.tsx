/* eslint-disable @typescript-eslint/no-unused-vars */
// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartItemsList from './CartItemsList';
import { useGetCartListQuery } from '@/redux/service/admin/cartApi';

export default function CartPage() {
  const { data: cartData, isLoading, refetch } = useGetCartListQuery();

  const carts = cartData?.data?.carts || [];
  const summary = cartData?.data?.summary;

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (carts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-6">Your cart is empty</p>
          <Link 
            href="/shop" 
            className="bg-[#AF6900] text-white px-6 py-3 rounded-md hover:bg-[#9E845C] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-bold text-[#482817] mb-6">
        Your Cart ({summary?.totalItems || carts.length} {carts.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left: Cart Items (50%) */}
        <div className="lg:w-1/2 w-full">
          <CartItemsList 
            carts={carts} 
            refetchCart={refetch} 
          />
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-px bg-black my-12"></div>

        {/* Right: Summary (50%) */}
        <div className="lg:w-1/2 w-full items-center text-center p-5 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-abhaya font-extrabold text-[#0B0B0B] mb-4 sm:mb-6">
            Summary
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between">
              <span className="text-[#1F1F1F] md:text-xl text-base font-medium">
                Sub Total:
              </span>
              <span className="font-extrabold text-2xl md:text-3xl font-abhaya text-[#C83734]">
                ${(summary?.subtotal || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1F1F1F] md:text-xl text-base font-medium">
                Shipping fee:
              </span>
              <span className="font-extrabold text-2xl md:text-3xl font-abhaya text-[#1F1F1F]">
                ${(summary?.totalShippingFee || 0).toFixed(2)}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between font-bold text-lg">
              <span className="text-[#1F1F1F] md:text-xl text-base font-medium">
                Total:
              </span>
              <span className="font-extrabold text-2xl md:text-3xl font-abhaya text-[#1F1F1F]">
                ${(summary?.estimatedTotal || 0).toFixed(2)}
              </span>
            </div>
          </div>
          <Link href="/checkout">
            <button className="w-full mt-4 sm:mt-6 bg-[#C77D2F] text-white py-2.5 sm:py-3 rounded-md hover:bg-[#B06A29] transition-colors font-medium">
              Pay Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}