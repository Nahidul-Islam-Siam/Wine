// components/dashboard/AddSocialMediaLink.tsx

"use client";
import React, { useState, useEffect } from "react";
import {
  useGetSocialLinksQuery,
  useUpdateSocialLinksMutation,
} from "@/redux/service/admin/cmsApi";
import { message } from "antd"; // optional: for better UX
import Swal from "sweetalert2";

export default function AddSocialMediaLink() {
  // Initialize form with empty or loading state
  const [formData, setFormData] = useState({
    pinterest: "",
    instagram: "",
    linkedin: "",
    facebook: "",
  });

  const {
    data: socialData,
    isLoading: isLoadingSocial,
    refetch,
  } = useGetSocialLinksQuery();

  const [updateSocialLinks, { isLoading: isUpdating }] =
    useUpdateSocialLinksMutation();

  // ✅ Load existing data into form when available
  useEffect(() => {
    if (socialData?.data) {
      const { pinterest, instagram, linkedin, facebook } = socialData.data;
      setFormData({
        pinterest: pinterest?.trim() || "",
        instagram: instagram?.trim() || "",
        linkedin: linkedin?.trim() || "",
        facebook: facebook?.trim() || "",
      });
    }
  }, [socialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ Include `id` and timestamps if they exist (required by your backend)
      const payload = {
        facebook: formData.facebook.trim(),
        instagram: formData.instagram.trim(),
        linkedin: formData.linkedin.trim(),
        pinterest: formData.pinterest.trim(),
      };

      const res = await updateSocialLinks(payload).unwrap();
      if (res.status === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.message || "Social media links updated successfully.",
          confirmButtonColor: "#AF6900",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            res.message || "Failed to update social links. Please try again.",
          confirmButtonColor: "#d33",
        });
      }
      // message.success("Social media links updated successfully!");
      // Optionally refetch to ensure consistency
      refetch();
    } catch (err) {
      console.error("Update failed:", err);
      message.error("Failed to update social links. Please try again.");
    }
  };

  // Optional: Show loading state on initial fetch
  if (isLoadingSocial && !socialData) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 w-full">
        <p className="text-gray-500">Loading social links...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 w-full">
      {/* Header */}
      <h2 className="text-[#482817] md:text-3xl text-2xl font-extrabold font-abhaya mb-4">
        Social Media Links
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Pinterest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pinterest
            </label>
            <input
              type="text"
              name="pinterest"
              value={formData.pinterest}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7997D] focus:border-[#A7997D]"
              placeholder="https://pinterest.com/yourprofile"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7997D] focus:border-[#A7997D]"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7997D] focus:border-[#A7997D]"
              placeholder="https://instagram.com/yourprofile"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="text"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7997D] focus:border-[#A7997D]"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isUpdating}
          className={`px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A7997D] ${
            isUpdating
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-[#AF6900] text-white hover:bg-[#8d7c68]"
          }`}
        >
          {isUpdating ? "Saving..." : "Save & Update"}
        </button>
      </form>
    </div>
  );
}
