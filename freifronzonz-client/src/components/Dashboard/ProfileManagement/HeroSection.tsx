/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useGetHeroDataQuery, useUpdateHeroDataMutation } from "@/redux/service/admin/cmsApi";
import Swal from "sweetalert2";
import Image from "next/image";

export default function HeroSection() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "", // note: we use "subtitle" in form, but send "subTitle" to API
    buttonText: "Explore Now", // kept for UI, though not in API
    intro: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: heroData,
    isLoading: isLoadingFetch,
    refetch,
  } = useGetHeroDataQuery();

  const [updateHero, { isLoading: isLoadingSave }] = useUpdateHeroDataMutation();

  // Load initial data and set image preview if exists
  useEffect(() => {
    if (heroData?.data) {
      setFormData({
        title: heroData.data.title || "",
        subtitle: heroData.data.subTitle || "",
        buttonText: "Explore Now", // not from API, so keep default
        intro: heroData.data.intro || "",
      });
      if (heroData.data.image) {
        setPreviewUrl(heroData.data.image);
      }
    }
  }, [heroData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(heroData?.data?.image || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // 🔑 Backend expects: { "data": JSON.stringify({ title, subTitle }), "image": file }
    formDataToSend.append(
      "data",
      JSON.stringify({
        title: formData.title,
        subTitle: formData.subtitle, // note: API field is "subTitle" (capital T)
        intro: formData.intro,
      })
    );

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    try {
      const res = await updateHero(formDataToSend).unwrap();

      if (res.status === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.message || "Hero section updated successfully!",
          confirmButtonColor: "#AF6900",
        });
        refetch(); // refresh to show updated data
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update hero section. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hero Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-4 border border-[#D9D9D9] rounded-lg focus:ring-2 focus:outline-none bg-white"
          placeholder="e.g. Wine Garden Tour"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sub Title
        </label>
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          className="w-full p-4 border border-[#D9D9D9] rounded-lg focus:ring-2 focus:outline-none bg-white"
          placeholder="e.g. Experience the finest wines"
        />
      </div>

      {/* Intro */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Intro
        </label>
        <input
          type="text"
          name="intro"
          value={formData.intro}
          onChange={handleChange}
          className="w-full p-4 border border-[#D9D9D9] rounded-lg focus:ring-2 focus:outline-none bg-white"
          placeholder="e.g. Discover a world of wine experiences"
        />
      </div>

      {/* Button Text (UI-only, not saved to API) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Button Text
        </label>
        <input
          type="text"
          name="buttonText"
          value={formData.buttonText}
          onChange={handleChange}
          className="w-full p-4 border border-[#D9D9D9] rounded-lg focus:ring-2 focus:outline-none bg-white"
          placeholder="e.g. Explore Now"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hero Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border border-[#D9D9D9] rounded-lg focus:ring-2 focus:outline-none bg-white"
        />
        {previewUrl && (
          <div className="mt-2">
            <Image
              width={200}
              height={200}
              src={previewUrl}
              alt="Hero preview"
              className="max-w-full max-h-40 object-contain rounded border"
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoadingSave}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
            isLoadingSave
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {isLoadingSave ? "Saving..." : "Save Change"}
        </button>
      </div>
    </form>
  );
}