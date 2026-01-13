// app/cart/page.tsx
'use client';

import { useState} from 'react';
import EventCartItemsList from './EventCartList';

// Mock cart data (replace with real data later)
const mockCartData = [
  {
    id: "cart1",
    productId: "prod1",
    quantity: "2",
    product: {
      id: "prod1",
      name: "Wine Tasting Event",
      sizeId: "Standard",
      des: "Join our exclusive wine tasting session with sommelier guidance.",
      images: ["uploads/event1.jpg"],
    },
    priceInfo: {
      finalPrice: 49.99,
      itemTotal: 99.98,
    },
  },
  {
    id: "cart2",
    productId: "prod2",
    quantity: "1",
    product: {
      id: "prod2",
      name: "Vineyard Tour",
      sizeId: "VIP",
      des: "Private tour of our premium vineyards with lunch included.",
      images: ["uploads/event2.jpg"],
    },
    priceInfo: {
      finalPrice: 120.00,
      itemTotal: 120.00,
    },
  },
];

// Mock summary data
const mockSummary = {
  subtotal: 219.98,
  totalDiscount: 10.00,
  totalItems: 3,
  totalQuantity: 3,
  totalShippingFee: 0,
  estimatedTotal: 209.98,
};

export default function CartPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate summary from cart data (optional)
  const summary = mockSummary;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Add email validation if provided
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Add phone validation if provided
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      alert("Form submitted!\n\nIn a real app, this would process payment.");
      console.log("Form Data:", formData);
    }
  };

  return (
    <section className="py-12 md:py-16 px-4 ">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-12 font-abhaya">
          Your Cart
        </h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-2">
          {/* Left: Cart Items */}
          <div className=" w-full">
            <EventCartItemsList carts={mockCartData} />
          </div>

          {/* Right: Checkout Form */}
          <div className=" w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-lg p-6 border border-gray-200">
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
    </section>
  );
}