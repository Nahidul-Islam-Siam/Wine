/* eslint-disable @typescript-eslint/no-explicit-any */
// components/EventCartItemsList.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import Swal from "sweetalert2";

interface CartItemsListProps {
  carts: any[];
  // Removed refetchCart and showSummary since no API
}

export default function EventCartItemsList({ carts }: CartItemsListProps) {
  // ✅ Mock cart management functions
  const handleUpdateQuantity = (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }
    // In real app: update local state
    console.log(`Update item ${cartItemId} to quantity ${newQuantity}`);
    Swal.fire({
      icon: "info",
      title: "Demo Mode",
      text: "Quantity updated (simulated).",
      confirmButtonColor: "#AF6900",
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    console.log(`Remove item ${cartItemId}`);
    Swal.fire({
      icon: "info",
      title: "Demo Mode",
      text: "Item removed (simulated).",
      confirmButtonColor: "#AF6900",
    });
  };

  if (carts.length === 0) {
    return (
      <div className="bg-white rounded-lg text-center border border-[#000000] p-6">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {carts.map((cartItem) => {
        const product = cartItem.product;
        const priceInfo = cartItem.priceInfo;
        const quantity = parseInt(cartItem.quantity);

        return (
          <div
            key={cartItem.id}
            className="p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row items-start gap-4 sm:gap-6 border border-gray-200"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
              <Image
                src={product.images?.[0] ||  "/placeholder.svg"}
                alt={product.name}
                width={128}
                height={128}
                className="object-cover w-full h-full rounded-md"
              />
            </div>

            <div className="flex-1 w-full">
              <h3 className="font-bold font-abhaya text-[#1F1F1F] text-base sm:text-xl">
                {product.name}{" "}
                <span className="text-sm text-gray-500">({product.sizeId})</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#968F8F] mt-1 mb-3 leading-relaxed">
                {product.des || product.shortDes}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <span className="text-[#C83734] font-abhaya font-extrabold text-xl sm:text-2xl">
                  ${priceInfo.finalPrice.toFixed(2)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(cartItem.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-[#E9E9E9] rounded hover:bg-gray-200"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-[#1F1F1F]">
                    {quantity.toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(cartItem.id, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-[#E9E9E9] rounded hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Link href={`/shop/${product.id}`} className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 border border-[#1F1F1F] rounded whitespace-nowrap hover:bg-gray-50">
                  View Details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="14"
                    viewBox="0 0 17 14"
                    fill="#1F1F1F"
                    className="shrink-0"
                  >
                    <path d="M9.625 0L8.64187 0.957688L13.8531 6.1875H0V7.5625H13.8531L8.64187 12.7689L9.625 13.75L16.5 6.875L9.625 0Z" />
                  </svg>
                </Link>
              </div>
            </div>

            <button
              onClick={() => handleRemoveItem(cartItem.id)}
              className="text-[#AF6900] hover:text-orange-700 self-start mt-1 sm:mt-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        );
      })}
    </div>
  );
}