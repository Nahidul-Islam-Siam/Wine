/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useGetOurStoryQuery, useUpdateOurStoryMutation } from "@/redux/service/admin/cmsApi";
import Swal from 'sweetalert2';
import Image from 'next/image';

export default function OurStory() {
  const [formData, setFormData] = useState({
    title: "",
    description: "", // this maps to "subTitle" in the API
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: storyData,
    isLoading: isLoadingFetch,
    refetch,
  } = useGetOurStoryQuery();

  const [updateStory, { isLoading: isLoadingSave }] = useUpdateOurStoryMutation();

  // Load data from API into form
  useEffect(() => {
    if (storyData?.data) {
      setFormData({
        title: storyData.data.title || "",
        description: storyData.data.subTitle || "", // API calls it "subTitle"
      });
      if (storyData.data.image) {
        setPreviewUrl(storyData.data.image);
      }
    }
  }, [storyData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(storyData?.data?.image || null);
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
        subTitle: formData.description, // note: API field is "subTitle"
      })
    );

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    try {
      const res = await updateStory(formDataToSend).unwrap();

      if (res.status === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.message || "Our story updated successfully!",
          confirmButtonColor: "#AF6900",
        });
        refetch();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update our story.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="e.g. Our Story Title"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="e.g. Our story subtitle..."
        />
      </div>

      {/* Optional: Image upload (matches your backend requirement) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Story Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border border-[#D9D9D9] rounded-md focus:ring-2 focus:outline-none"
        />
        {previewUrl && (
          <div className="mt-2">
            <Image
              width={200}
              height={200}
              src={previewUrl}
              alt="Story preview"
              className="max-w-full max-h-40 object-contain rounded border"
            />
          </div>
        )}
      </div>

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