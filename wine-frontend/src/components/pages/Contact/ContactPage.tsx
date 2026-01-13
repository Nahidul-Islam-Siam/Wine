/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ContactPage.tsx
"use client";
import { useCreateContactMutation } from "@/redux/service/auth/customer/contactApi";
import { useState } from "react";

export default function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [createContact] = useCreateContactMutation();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      // ✅ Call real API
      const response = await createContact(formData).unwrap();
      
      if (response.status) {
        setFormData({ name: "", email: "", phone: "", message: "" });
        setSubmitSuccess(true);
      } else {
        setSubmitError(response.message || "Failed to send message. Please try again.");
      }
    } catch (error: any) {
      const message = error?.data?.message || error?.message || "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-abhaya font-extrabold text-center text-[#000000] mb-12">
          Contact Us
        </h1>

        {/* Contact Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Call To Us */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#D1D5DB]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#C83734] p-2 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M11.1967 6.01987L7.13712 1.33387C6.66912 0.793872 5.81112 0.796272 5.26752 1.34107L1.92912 4.68547C0.93552 5.68027 0.651119 7.15747 1.22592 8.34187C4.65986 15.4518 10.394 21.194 17.4991 24.6379C18.6823 25.2127 20.1583 24.9283 21.1519 23.9335L24.5215 20.5579C25.0675 20.0119 25.0687 19.1491 24.5239 18.6811L19.8199 14.6431C19.3279 14.2207 18.5635 14.2759 18.0703 14.7703L16.4335 16.4095C16.3497 16.4973 16.2394 16.5552 16.1195 16.5743C15.9997 16.5933 15.8768 16.5725 15.7699 16.5151C13.0945 14.9744 10.8751 12.7521 9.33792 10.0747C9.28035 9.96757 9.25951 9.84455 9.27858 9.72446C9.29766 9.60437 9.3556 9.49386 9.44352 9.40987L11.0755 7.77667C11.5699 7.27987 11.6239 6.51187 11.1967 6.01867V6.01987Z"
                    stroke="white"
                    stroke-width="1.86105"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#000000]">Call To Us</h3>
            </div>
            <p className="text-sm md:text-base text-[#968F8F] mb-2">
              We are available 24/7, 7 days a week.
            </p>
            <p className="text-sm md:text-base text-[#000000] font-medium">
              Phone:{" "}
              <a href="tel:+8801611112222" className="hover:text-[#AF6900]">
                +8801611112222
              </a>
            </p>
          </div>

          {/* Write To Us */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#D1D5DB]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 p-2 bg-[#C83734] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="19"
                  viewBox="0 0 26 19"
                  fill="none"
                >
                  <path
                    d="M0.929688 0.930664L12.9297 9.33066L24.9297 0.930664M0.929688 17.7307H24.9297V0.930664H0.929688V17.7307Z"
                    stroke="white"
                    stroke-width="1.86105"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#000000]">Write To Us</h3>
            </div>
            <p className="text-sm md:text-base text-[#968F8F] mb-2">
              Fill out our form and we will contact you within 24 hours.
            </p>
            <p className="text-sm md:text-base text-[#000000] font-medium">
              Emails:{" "}
              <a
                href="mailto:customer@exclusive.com"
                className="hover:text-[#AF6900]"
              >
                customer@exclusive.com
              </a>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              <a
                href="mailto:support@exclusive.com"
                className="hover:text-[#AF6900]"
              >
                support@exclusive.com
              </a>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#D1D5DB]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-[#000000] mb-2"
                >
                  YOUR NAME
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g John son"
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-[#000000] mb-2"
                >
                  YOUR EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="EMAIL Address"
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-[#000000] mb-2"
                >
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="YOUR PHONE"
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs font-medium text-[#000000] mb-2"
              >
                YOUR MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={Number( 6)} // Convert the string to a number, default to 6 if the value is not a number
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-transparent resize-none"
                required
              />
            </div>

            {submitSuccess && (
              <div className="p-4 bg-green-100 text-green-800 rounded-lg">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {submitError && (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg">
                {submitError}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? "bg-[#AF6900]/70 cursor-not-allowed"
                    : "bg-[#AF6900] text-white hover:bg-[#9E845C]"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}