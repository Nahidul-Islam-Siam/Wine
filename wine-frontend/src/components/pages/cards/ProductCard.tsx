/* eslint-disable @typescript-eslint/no-unused-vars */
// components/cards/ProductCard.tsx
"use client";

import { Heart, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  addToCart as addToLocalCart,
  removeFromCart,
} from "@/redux/slices/cartSlice";

import Swal from "sweetalert2";
import { useAddToCartMutation } from "@/redux/service/admin/cartApi";

// ✅ Interface that exactly matches your API response
interface Product {
  id: string;
  name: string;
  shortDes: string;
  des: string;
  images: string[];
  size: string;
  price: string;
  discount: boolean;
  discountPercent: string;
  stock: boolean;
  quantity: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const [addToCartApi, { isLoading }] = useAddToCartMutation(); // ✅ RTK Query mutation

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-[#EA1E1E]">
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatPrice = (priceStr: string): string => {
    if (!priceStr) return "0.00";
    const priceNum = parseFloat(priceStr);
    return isNaN(priceNum) ? "0.00" : priceNum.toFixed(2);
  };

  const getOriginalPrice = (): number | null => {
    if (product.discount && parseInt(product.discountPercent) > 0) {
      const currentPrice = parseFloat(product.price);
      const discountPercent = parseInt(product.discountPercent);
      const originalPrice = currentPrice / (1 - discountPercent / 100);
      return originalPrice;
    }
    return null;
  };

  // ✅ Hybrid Add to Cart: Local + API
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    // 1️⃣ Update LOCAL cart instantly (optimistic UI)
    const cartProduct = {
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: parseFloat(formatPrice(product.price)),
      originalPrice: getOriginalPrice()
        ? getOriginalPrice()!
        : parseFloat(formatPrice(product.price)),
      description: product.des,
      category: product.category.name,
      bottleSize: product.size,
      brand: product.brand.name,
    };

    dispatch(addToLocalCart(cartProduct));

    // 2️⃣ Sync with REAL API
    try {
      await addToCartApi({
        productId: product.id,
        quantity: "1",
      }).unwrap();

      // ✅ API Success: Show success message
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart.`,
        confirmButtonColor: "#AF6900",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      // ❌ API Failed: Revert local cart
      dispatch(removeFromCart(product.id));

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to add to cart. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <Link
      href={`/shop/${product.id}`}
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative bg-gray-50 h-48 sm:h-56 md:h-64 flex items-center justify-center overflow-hidden group">
        <Image
          width={400}
          height={400}
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />

        {product.discount && product.discountPercent && (
          <div className="absolute top-3 right-3 bg-orange-400 text-white px-2 py-1 rounded text-xs font-bold">
            -{product.discountPercent}%
          </div>
        )}

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-2">
          <button
            onClick={handleAddToCart}
            disabled={isLoading} // ✅ Disable during API call
            className="w-8 h-8 flex items-center justify-center border border-[#482817] hover:bg-gray-100 disabled:opacity-50"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5 text-[#482817]" />
          </button>

          {/* <button className="w-8 h-8 flex items-center justify-center border border-[#482817] hover:bg-gray-100">
            <Heart className="w-5 h-5 text-[#482817]" />
          </button> */}
        </div>
      </div>

      <div className="p-4 text-center sm:p-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          {renderStars(5)}
          <span className="text-xs md:text-sm text-[#482817]">(0 reviews)</span>
        </div>

        <h3 className="text-sm font-semibold text-[#482817] mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-baseline justify-center gap-2">
          {getOriginalPrice() ? (
            <>
              {/* <span className="text-xs text-gray-500 line-through">
                ${getOriginalPrice()!.toFixed(2)}
              </span> */}
              <span className="text-sm font-bold text-[#968F8F]">
                ${formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-[#968F8F]">
              ${formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
