/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Swal from "sweetalert2";
import Image from "next/image";
import {
  useGetBlogByAdminQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  Blog,
} from "@/redux/service/admin/cmsApi";

export default function BlogManagement() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [active, setActive] = useState(true);

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    blog: Blog | null;
  }>({
    isOpen: false,
    blog: null,
  });

  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

  const {
    data: blogsData,
    isLoading,
    isError,
    refetch,
  } = useGetBlogByAdminQuery();

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  // Handle create image preview
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  // Handle edit image preview
  useEffect(() => {
    if (editImageFile) {
      const url = URL.createObjectURL(editImageFile);
      setEditPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (editModal.blog?.images[0]) {
      setEditPreviewUrl(editModal.blog.images[0]);
    }
  }, [editImageFile, editModal.blog]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditImageFile(file);
  };

  const openEditModal = (blog: Blog) => {
    setEditModal({ isOpen: true, blog });
    setTitle(blog.title);
    setExcerpt(blog.des);
    setActive(blog.active);
    setEditImageFile(null);
    setEditPreviewUrl(blog.images[0] || null);
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, blog: null });
    setTitle("");
    setExcerpt("");
    setActive(true);
    setEditImageFile(null);
    setEditPreviewUrl(null);
  };

  const handleAddPost = async () => {
    if (!title.trim() || !excerpt.trim() || !imageFile) {
      Swal.fire("Warning", "Please fill all fields and select an image.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify({ title, des: excerpt }));
    formData.append("images", imageFile);

    try {
      const response = await createBlog(formData).unwrap();
      if (response.status) {
        Swal.fire("Success", response.message, "success");
        setTitle("");
        setExcerpt("");
        setImageFile(null);
        setPreviewUrl(null);
        refetch();
      } else {
        Swal.fire("Error", response.message || "Failed to create blog post.", "error");
      }
    } catch (err: any) {
      const message = err?.data?.message || "Failed to create blog post.";
      Swal.fire("Error", message, "error");
    }
  };

  const handleUpdatePost = async () => {
    if (!editModal.blog?.id || !title.trim() || !excerpt.trim()) {
      Swal.fire("Warning", "Please fill all fields.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify({ title, des: excerpt, active }));

    if (editImageFile) {
      formData.append("images", editImageFile);
    }

    try {
      const response = await updateBlog(formData).unwrap();
      if (response.status) {
        Swal.fire("Success", response.message, "success");
        closeEditModal();
        refetch();
      } else {
        Swal.fire("Error", response.message || "Failed to update blog post.", "error");
      }
    } catch (err: any) {
      const message = err?.data?.message || "Failed to update blog post.";
      Swal.fire("Error", message, "error");
    }
  };

  const handleDeletePost = async (id: string) => {
    Swal.fire({
      title: "Delete Post?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteBlog(id).unwrap();
          if (response.status) {
            Swal.fire("Deleted!", response.message, "success");
            refetch();
          } else {
            Swal.fire("Error", response.message || "Failed to delete blog post.", "error");
          }
        } catch (err: any) {
          const message = err?.data?.message || "Failed to delete blog post.";
          Swal.fire("Error", message, "error");
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#AF6900] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading blog posts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load blog posts.
      </div>
    );
  }

  const blogs = blogsData?.data?.blogs || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Published Blog Section */}
      <div className="p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 sm:mb-8 border-b pb-4">
          Published Blog
        </h2>

        {blogs.length > 0 ? (
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="blog-swiper pb-8"
          >
            {blogs.map((post, idx) => (
              <SwiperSlide key={post.id}>
                <div className="p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col group hover:border-[#AF6900]/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xl sm:text-2xl font-serif font-black text-[#AF6900]">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm">
                      <button
                        onClick={() => openEditModal(post)}
                        className="text-gray-700 hover:text-[#AF6900] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-[#AF6900] hover:text-[#8d5a00] font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 items-end mt-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-gray-800 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {post.des}
                      </p>
                    </div>

                    {post.images && post.images.length > 0 && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                        <Image
                          width={80}
                          height={80}
                          src={post.images[0]}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No blog posts published yet.</p>
          </div>
        )}
      </div>

      {/* Add New Blog Form */}
      <div className="p-4 sm:p-8 mt-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 sm:w-2 sm:h-8 bg-[#AF6900] rounded-full"></span>
          Add New Blog Post
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form Fields */}
          <div className="lg:col-span-3 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#AF6900]/20 focus:border-[#AF6900] focus:bg-white outline-none transition-all"
                placeholder="E.g. The Best Wine Pairings for Summer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#AF6900]/20 focus:border-[#AF6900] focus:bg-white outline-none transition-all resize-none"
                placeholder="Give a brief summary..."
              />
            </div>

            <button
              onClick={handleAddPost}
              disabled={!title.trim() || !excerpt.trim() || !imageFile || isCreating}
              className={`w-full px-6 py-3 sm:px-10 sm:py-4 rounded-xl text-white font-bold text-base shadow-lg transition-all ${
                !title.trim() || !excerpt.trim() || !imageFile || isCreating
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#AF6900] hover:bg-[#8d5a00]"
              }`}
            >
              {isCreating ? "Publishing..." : "Publish Post"}
            </button>
          </div>

          {/* Image Upload */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Feature Image
            </label>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-[#AF6900] transition-all cursor-pointer"
              >
                {previewUrl ? (
                  <div className="relative w-full h-full p-1">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <span className="text-white text-sm font-medium">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm">Click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editModal.isOpen && editModal.blog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Edit Blog Post</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Active Toggle */}
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={active}
                          onChange={(e) => setActive(e.target.checked)}
                        />
                        <div className={`block w-11 h-6 rounded-full ${active ? "bg-[#AF6900]" : "bg-gray-300"}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${active ? "transform translate-x-5" : ""}`}></div>
                      </div>
                      <div className="ml-3 text-sm font-medium text-gray-700">
                        {active ? "Published" : "Unpublished"}
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Toggle to {active ? "hide" : "show"} this blog post.
                    </p>
                  </div>

                  <button
                    onClick={handleUpdatePost}
                    disabled={!title.trim() || !excerpt.trim() || isUpdating}
                    className={`px-5 py-2 rounded-lg text-white font-medium w-full ${
                      !title.trim() || !excerpt.trim() || isUpdating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#AF6900] hover:bg-[#8d5a00]"
                    }`}
                  >
                    {isUpdating ? "Updating..." : "Update Post"}
                  </button>
                </div>

                {/* Image Preview */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Feature Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="mb-3 w-full"
                  />
      {editPreviewUrl && (
  <div className="border rounded-lg overflow-hidden w-full max-w-[300px] h-[200px] relative">
    <Image
      src={editPreviewUrl}
      alt="Blog preview"
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 300px"
    />
  </div>
)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .blog-swiper .swiper-button-next,
        .blog-swiper .swiper-button-prev {
          color: #af6900;
          background: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }
        .blog-swiper .swiper-button-next:after,
        .blog-swiper .swiper-button-prev:after {
          font-size: 14px;
          font-weight: bold;
        }
        .blog-swiper .swiper-button-disabled {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}