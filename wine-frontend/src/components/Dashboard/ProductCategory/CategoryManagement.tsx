/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { message, Spin } from "antd";
import CategoryTable from "./CategoryTable";
import { 
  useGetCategoryListQuery, 
  useCreateCategoryMutation 
} from "@/redux/service/admin/categoryApi";
import Swal from "sweetalert2";

export default function CategoryManagement() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDes, setCategoryDes] = useState(""); // ✅ description field
  const [isAdding, setIsAdding] = useState(false); // ✅ loading state for button

  // ✅ Use real data from API
  const { data: categoriesResponse, isLoading, isError, refetch } = useGetCategoryListQuery();
  const categories = categoriesResponse?.data?.category || [];

  const [createCategory] = useCreateCategoryMutation();

  // ✅ Add category with only name + des
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      message.error("Category name is required");
      return;
    }
    if (!categoryDes.trim()) {
      message.error("Description is required");
      return;
    }

    setIsAdding(true); // ✅ Start loading

    // ✅ Build FormData with ONLY allowed fields
    const formData = new FormData();
    formData.append("name", categoryName.trim());
    formData.append("des", categoryDes.trim());

    try {
      const res = await createCategory(formData).unwrap();
      
      if (res.status) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: res.message || "Category has been added successfully.",
          confirmButtonColor: "#AF6900",
          timer: 2000,
          showConfirmButton: false,
        }); 
        // ✅ Reset form
        setCategoryName("");
        setCategoryDes("");
        // ✅ Refresh list
        refetch();
      } else {
        message.error(res.message || "Failed to add category.");
      }
    } catch (error: any) {
      const errorMsg = error?.data?.message || error?.message || "An error occurred while adding the category.";
      message.error(errorMsg);
    } finally {
      setIsAdding(false); // ✅ Stop loading (even on error)
    }
  };

  // ✅ Loading & Error States
  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 font-marcellus">Category Management</h1>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 font-marcellus">Category Management</h1>
        <p className="text-red-500">Failed to load categories.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 font-marcellus">
        Category Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Category Form */}
        <div className="p-5 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4 font-roboto">
            Add New Category
          </h2>

          <div className="space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-sm md:text-base text-[#4E4E4A] mb-1 font-roboto font-medium">
                Category Name *
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full p-2 border rounded-md font-roboto border-[#D9D9D9] bg-white"
                placeholder="Enter category name"
                disabled={isAdding} // ✅ Disable input during loading
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm md:text-base text-[#4E4E4A] mb-1 font-roboto font-medium">
                Description *
              </label>
              <textarea
                value={categoryDes}
                onChange={(e) => setCategoryDes(e.target.value)}
                className="w-full p-2 border rounded-md font-roboto border-[#D9D9D9] bg-white"
                placeholder="Enter category description"
                rows={3}
                disabled={isAdding} // ✅ Disable input during loading
              />
            </div>

            {/* ✅ Add Button with Loader */}
            <button
              className="w-full mt-2 bg-[#AF6900] text-white py-4 rounded-md font-roboto flex items-center justify-center"
              onClick={handleAddCategory}
              disabled={isAdding} // ✅ Disable button during loading
            >
              {isAdding ? (
                <>
                  <Spin size="small" className="mr-2" />
                  Adding...
                </>
              ) : (
                "Add Category"
              )}
            </button>
          </div>
        </div>

        {/* Category List */}
        <div className="p-5 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4 font-roboto">Category List</h2>
          <CategoryTable categories={categories} />
        </div>
      </div>
    </div>
  );
}