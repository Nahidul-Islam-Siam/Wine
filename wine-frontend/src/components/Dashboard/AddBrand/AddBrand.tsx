/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Upload, message, Spin } from "antd";
import Image from "next/image";
import BrandTable from "./BrandTable";
import {
  useGetBrandListQuery,
  useCreateBrandMutation,
} from "@/redux/service/admin/brandApi";
import Swal from "sweetalert2";

export default function BrandManagement() {
  const {
    data: brandsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetBrandListQuery();
  const [createBrand] = useCreateBrandMutation();

  const brands = brandsResponse?.data?.brand || [];

  const [brandName, setBrandName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ✅ Handle Add Brand with Ant Design validation (no SweetAlert)
  const handleAddBrand = async () => {
    // Validation
    if (!brandName.trim()) {
      message.error("Brand name is required");
      return;
    }
    if (!logoFile) {
      message.error("Logo is required");
      return;
    }

    // Validate file
    if (logoFile.size > 10 * 1024 * 1024) {
      message.error("File must be smaller than 10MB");
      return;
    }
    if (!logoFile.type.match("image/(png|jpeg|jpg)")) {
      message.error("Only PNG/JPG files allowed");
      return;
    }

    // Build FormData
    const formData = new FormData();
    const payload = { name: brandName.trim() };
    formData.append("data", JSON.stringify(payload));
    formData.append("img", logoFile);

    setIsSubmitting(true);

    try {
      const res = await createBrand(formData).unwrap();
      if (res?.status === true) {
        Swal.fire({
          icon: "success",
          title: res.message || "Brand added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res?.message || "Failed to add brand.",
          confirmButtonColor: "#d33",
        });
      }
      // Reset form
      setBrandName("");
      setLogoFile(null);
      setPreviewUrl(null);

      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to add brand.";
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj;
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      message.error("File must be smaller than 10MB");
      return;
    }
    if (!file.type.match("image/(png|jpeg|jpg)")) {
      message.error("Only PNG/JPG files allowed");
      return;
    }

    setLogoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setLogoFile(null);
    setPreviewUrl(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 font-marcellus">
          Brand Management
        </h1>
        <p>Loading brands...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 font-marcellus">
          Brand Management
        </h1>
        <p className="text-red-500">Failed to load brands.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 font-marcellus">
        Brand Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Brand Form */}
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4 font-roboto">
            Add New Brand
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm md:text-base text-[#4E4E4A] mb-1 font-roboto font-medium">
                Brand Name *
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full p-2 border rounded-md font-roboto border-[#D9D9D9] bg-white"
                placeholder="Enter brand name"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm md:text-base text-[#4E4E4A] mb-1 font-roboto font-medium">
                Brand Logo *
              </label>

              {/* Upload Area */}
              {!previewUrl ? (
                <Upload.Dragger
                  name="logo"
                  maxCount={1}
                  accept=".png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  showUploadList={false}
                  disabled={isSubmitting}
                  className="border-dashed rounded-[14px] border border-[#D1D5DC] bg-white"
                >
                  <div className="p-6 text-center justify-center flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        d="M24 6V30"
                        stroke="#A7997D"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M34 16L24 6L14 16"
                        stroke="#A7997D"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V30"
                        stroke="#A7997D"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-gray-600 font-roboto mt-2">
                      Click to upload images
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-roboto">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </Upload.Dragger>
              ) : (
                /* Preview Area with Delete Button */
                <div className="border rounded-[14px] border-[#D1D5DC] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Image
                        width={48}
                        height={48}
                        src={previewUrl}
                        alt="Preview"
                        className="h-12 w-12 object-contain"
                      />
                      <span className="text-sm text-gray-600 font-roboto">
                        {logoFile?.name}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveLogo}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-700 font-roboto text-sm disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="w-full mt-2 bg-[#AF6900] text-white py-4 rounded-md font-roboto flex items-center justify-center"
              onClick={handleAddBrand}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spin size="small" className="mr-2" />
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>

        {/* Brand List */}
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4 font-roboto">Brand List</h2>
          <BrandTable brands={brands} />
        </div>
      </div>
    </div>
  );
}