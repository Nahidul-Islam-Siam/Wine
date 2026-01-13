/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, ZoomIn, Facebook, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { useGetProductByIdQuery } from "@/redux/service/admin/productApi";
import { useAddToCartMutation } from "@/redux/service/admin/cartApi"; // ✅ NEW
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart as addToLocalCart, removeFromCart } from "@/redux/slices/cartSlice"; // ✅ RENAMED
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:4200";
const DUMMY_IMAGE = "https://via.placeholder.com/500x500?text=Product+Image";

const getImageUrl = (imgPath: string): string => {
  if (!imgPath) return DUMMY_IMAGE;
  if (imgPath.startsWith("http")) return imgPath;
  return `${API_BASE_URL}/${imgPath}`;
};

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(DUMMY_IMAGE);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [isAdding, setIsAdding] = useState(false); // ✅ Loading state

  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id as string);
  const [addToCartApi] = useAddToCartMutation(); // ✅ NEW
  const dispatch = useDispatch();

  useEffect(() => {
    if (product?.data?.images && product.data.images.length > 0) {
      const imgUrls = product.data.images.map(getImageUrl);
      setMainImage(imgUrls[0]);
    } else {
      setMainImage(DUMMY_IMAGE);
    }
  }, [product]);

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    const maxQty = product?.data?.quantity ? parseInt(product.data.quantity, 10) : Infinity;
    if (quantity < maxQty) setQuantity(quantity + 1);
  };

  // ✅ HYBRID ADD TO CART (with quantity as string for API)
  const handleAddToCart = async () => {
    if (!product?.data?.stock) {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: "This product is currently unavailable.",
        confirmButtonColor: "#AF6900",
      });
      return;
    }

    setIsAdding(true);

    const cartItem = {
      id: product.data.id,
      name: product.data.name,
      image: getImageUrl(product.data.images?.[0] || ""),
      price: parseFloat(finalPrice),
      originalPrice: discount && discountPercent
        ? parseFloat(product.data.price)
        : parseFloat(finalPrice),
      description: product.data.des || product.data.shortDes || "",
      category: product.data.category?.name || "Uncategorized",
      brand: product.data.brand?.name || "Unknown",
      quantity: quantity,
    };

    // 1️⃣ Update LOCAL cart
    dispatch(addToLocalCart(cartItem as any));

    // 2️⃣ Call API with QUANTITY AS STRING
    try {
      await addToCartApi({
        productId: product.data.id,
        quantity: quantity.toString(), // 🔑 Sent as string to match backend
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${quantity} × ${product.data.name} has been added to your cart.`,
        confirmButtonColor: "#AF6900",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      // 3️⃣ Rollback on API failure
      dispatch(removeFromCart(product.data.id));
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: error?.data?.message || "Failed to add to cart. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError || !product?.data) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const {
    name,
    shortDes,
    des,
    images = [],
    price,
    discount,
    discountPercent,
    stock,
    quantity: availableQty,
    category,
    brand,
    reviews = [],
  } = product.data;

  const finalPrice = discount && discountPercent
    ? (parseFloat(price) * (1 - parseFloat(discountPercent) / 100)).toFixed(2)
    : price;

  const imageUrls = images.length > 0
    ? images.map(getImageUrl)
    : [DUMMY_IMAGE];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#C77D2F]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#C77D2F]">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#482817]">{category?.name || "Product"}</span>
        </div>

        {/* Product Section */}
        <div className="p-6 rounded-lg lg:p-10 mb-8 bg-white">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="relative overflow-hidden group">
                <div className="aspect-square flex items-center justify-center bg-gray-50">
                  <Image
                    src={mainImage}
                    alt={name}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                  />
                </div>
                <button className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all">
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {imageUrls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(image)}
                    className={`relative bg-gray-50 rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === image
                        ? "border-[#C77D2F]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <div className="aspect-square flex items-center justify-center p-2">
                      <Image
                        src={image}
                        alt={`Product view ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-[48px] font-extrabold text-black">{name}</h1>

              <div className="flex items-center gap-3">
                {discount && discountPercent && (
                  <div className="text-lg md:text-xl text-gray-500 line-through">${price}</div>
                )}
                <div className="text-2xl md:text-3xl font-extrabold font-abhaya text-[#AF6900]">
                  ${finalPrice}
                </div>
                {discount && discountPercent && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <p className="text-[#968F8F] font-normal text-sm md:text-base leading-relaxed">
                {shortDes || des || "No description available."}
              </p>

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center border border-gray-300 overflow-hidden w-32">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-full text-center border-x border-gray-300 py-2 focus:outline-none"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-[#9E845C] font-marcellus font-normal hover:bg-[#B36D25] text-white text-sm md:text-base py-3 px-6 transition-colors disabled:opacity-50"
                >
                  {isAdding ? "Adding..." : "ADD TO CART"}
                </button>

                {/* <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button> */}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-[#AF6900] font-marcellus hover:bg-[#8A5620] text-sm md:text-base text-white font-medium py-3 px-6 transition-colors disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "BUY NOW"}
              </button>

              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-sm md:text-base font-normal text-[#868686] w-24">Category:</span>
                  <span className="text-sm md:text-base font-normal text-[#482817]">
                    {category?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm md:text-base font-normal text-[#868686] w-24">Brand:</span>
                  <span className="text-sm md:text-base font-normal text-[#482817]">
                    {brand?.name || "N/A"}
                  </span>
                </div>
                {product.data.tag && (
                  <div className="flex items-start gap-3">
                    <span className="text-sm md:text-base font-normal text-[#868686] w-24">Tags:</span>
                    <Link
                      href={`/shop?tag=${product.data.tag}`}
                      className="text-sm md:text-base font-normal text-[#482817]"
                    >
                      {product.data.tag}
                    </Link>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="pt-2">
                {stock ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm md:text-base font-normal text-[#868686]">In Stock</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({availableQty} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm md:text-base font-normal text-[#868686]">Sold Out</span>
                  </div>
                )}
              </div>

              {/* Social Share */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm md:text-base font-normal text-[#868686]">Share:</span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                      <Facebook className="w-4 h-4 text-[#1877F2]" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                      <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                      <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                      <svg
                        className="w-4 h-4 text-[#25D366]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-[#FAF4EE] rounded-lg p-6">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-8 py-3 font-medium transition-colors relative ${
                  activeTab === "description"
                    ? "text-[#482817] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#C77D2F]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-8 py-3 font-medium transition-colors relative ${
                  activeTab === "reviews"
                    ? "text-[#482817] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#C77D2F]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {des || shortDes || "No detailed description available."}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#482817] mb-2">Add A Review</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Your email address will not be published. Required fields are marked *
                  </p>

                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-gray-300 hover:text-yellow-500 w-5 h-5"
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C77D2F] w-full"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C77D2F] w-full"
                    />
                  </div>

                  <textarea
                    placeholder="Your Review"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C77D2F] resize-none mb-4"
                  ></textarea>

                  <div className="flex items-start mb-6">
                    <input type="checkbox" id="save-info" className="mt-1 mr-2" />
                    <label htmlFor="save-info" className="text-xs text-gray-500">
                      Save my name, email, and website in this browser for the next time I comment
                    </label>
                  </div>

                  <button className="w-full md:w-auto px-6 py-2 bg-[#C77D2F] text-white font-medium rounded-md hover:bg-[#B06A29] transition-colors">
                    Submit
                  </button>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet.</p>
                ) : (
                  reviews.map((review: any, index: number) => (
                    <div key={index} className="border-t border-gray-200 pt-6">
                      <div className="flex items-start gap-4">
                        <Image
                          width={48}
                          height={48}
                          src="https://via.placeholder.com/48"
                          alt="Reviewer"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{review.reviewerName || "Anonymous"}</span>
                            <div className="text-yellow-500">★★★★★</div>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}