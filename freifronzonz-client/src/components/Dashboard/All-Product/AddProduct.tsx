/* eslint-disable @typescript-eslint/no-explicit-any */
// app/add-product/page.tsx

"use client";

import { Form, Input, Upload, message, Select } from "antd";
import { useState } from "react";
import Image from "next/image";
import { useGetCategoryListQuery } from "@/redux/service/admin/categoryApi";
import { useGetBrandListQuery } from "@/redux/service/admin/brandApi";
import Swal from "sweetalert2";
import { useCreateProductMutation } from "@/redux/service/admin/productApi"; // ✅ Add this import
import { useRouter } from "next/navigation";
import { useGetSizeListQuery } from "@/redux/service/admin/bottleSizeApi";

const { TextArea } = Input;
const { Option } = Select;

export default function AddProductPage() {
  const [form] = Form.useForm();
  const [productImageFiles, setProductImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // ✅ Add product mutation
  const [createProduct] = useCreateProductMutation();

  const { data: categoryData } = useGetCategoryListQuery();
  const { data: brandData } = useGetBrandListQuery();
  const {data:sizeData} = useGetSizeListQuery();

  const category = categoryData?.data.category || [];
  const brand = brandData?.data.brand || [];
  const size = sizeData?.data.sizes || [];

  const handleProductImageChange = ({ fileList }: any) => {
    const files = fileList
      .map((item: any) => item.originFileObj)
      .filter(Boolean);

    for (const file of files) {
      if (file.size > 25 * 1024 * 1024) {
        message.error("Each image must be smaller than 25MB");
        return;
      }
      if (!file.type.match("image/(png|jpeg|jpg|gif)")) {
        message.error("Only PNG, JPG, GIF files allowed");
        return;
      }
    }

    setProductImageFiles(files);
    setPreviewUrls(files.map((file: File) => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index: number) => {
    setProductImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onFinish = async (values: any) => {
    if (productImageFiles.length === 0) {
      message.error("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Build data object exactly as your backend expects
      const dataPayload = {
        name: values.productName,
        shortDes: values.shortDescription, // ✅ Added short description
        des: values.description,
        sizeId: values.bottleSize,
        price: values.price,
        discount: values.offer ? values.offer.trim() !== "" : false,
        discountPercent: values.offer || "0",
        stock: values.stockStatus === "inStock" ? true : false,
        quantity: values.totalProduct,
        categoryId: values.category,
        brandId: values.brandName,
        // tag will be handled by backend (optional)
      };

      // ✅ Create FormData with data as JSON string + image files
      const formData = new FormData();
      formData.append("data", JSON.stringify(dataPayload));

      // ✅ Append all image files (backend expects multiple "images" fields)
      for (let i = 0; i < productImageFiles.length; i++) {
        formData.append("images", productImageFiles[i]);
      }

      // ✅ Send to backend
      const res = await createProduct(formData).unwrap();

      if (res.status === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res?.message || "Product added successfully.",
          confirmButtonColor: "#AF6900",
          timer: 2000,
          showConfirmButton: false,
        });
        // ✅ Redirect to all products page after success
        router.push("/dashboard/all-product");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res?.message || "Failed to add product.",
          confirmButtonColor: "#d33",
        });
      }

      // ✅ Reset form
      form.resetFields();
      setProductImageFiles([]);
      setPreviewUrls([]);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to add product.";
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 mx-auto ant-something rounded-xl">
      <h1 className="text-2xl font-semibold text-[#A7997D] mb-6">
        Add New Product
      </h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6"
      >
        {/* Product Name/Title */}
        <Form.Item
          label={
            <span className="text-[#A7997D] font-medium">
              Product Name/Title *
            </span>
          }
          name="productName"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input
            placeholder="Red Wine"
            className="rounded-[8px] border border-[#D9D9D9] bg-white"
          />
        </Form.Item>

        {/* ✅ Short Description Field (NEW) */}
        <Form.Item
          label={
            <span className="text-[#A7997D] font-medium">
              Short Description *
            </span>
          }
          name="shortDescription"
          rules={[
            { required: true, message: "Please enter short description" },
          ]}
        >
          <Input
            placeholder="Brief product summary"
            className="rounded-[8px] border border-[#D9D9D9] bg-white"
          />
        </Form.Item>

        {/* Brand Name + Category */}
        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label={
              <span className="text-[#A7997D] font-medium">
                Select Brand Name *
              </span>
            }
            name="brandName"
            rules={[{ required: true, message: "Please select brand name" }]}
          >
            <Select
              placeholder="Winery"
              className="rounded-[8px] border border-[#D9D9D9] bg-white"
            >
              {brand.map((br) => (
                <Option key={br.id} value={br.id}>
                  {br.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[#A7997D] font-medium">
                Select Category *
              </span>
            }
            name="category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select
              placeholder="Red Wine"
              className="rounded-[8px] border border-[#D9D9D9] bg-white"
            >
              {category.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Bottle Size + Tag + Offer + Price + Total Product */}
        <div className="grid grid-cols-5 gap-4">
          <Form.Item
            label={
              <span className="text-[#A7997D] font-medium">
                Select Bottle Size 
              </span>
            }
            name="bottleSize"
            rules={[{ required: true, message: "Please Select Bottle Size" }]}
          >
            <Select
              placeholder="500ml..."
              className="rounded-[8px] border border-[#D9D9D9] bg-white"
            >
              {size.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-600 font-medium">Tag (Optional)</span>
            }
            name="tag"
          >
            <Input placeholder="Hot" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-600 font-medium">
                Offer % (Optional)
              </span>
            }
            name="offer"
          >
            <Input placeholder="10" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[#A7997D] font-medium">Price $ *</span>
            }
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input placeholder="500" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[#A7997D] font-medium">
                Total Product *
              </span>
            }
            name="totalProduct"
            rules={[{ required: true, message: "Please enter total product" }]}
          >
            <Input placeholder="50" />
          </Form.Item>
        </div>

        {/* Stock Product */}
        <Form.Item
          label={
            <span className="text-[#A7997D] font-medium">Stock Product *</span>
          }
          name="stockStatus"
          rules={[{ required: true, message: "Please select stock status" }]}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="inStock"
                name="stockStatus"
                value="inStock"
                className="mr-2"
                defaultChecked
              />
              <label htmlFor="inStock" className="text-sm font-medium">
                In Stock
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="outOfStock"
                name="stockStatus"
                value="outOfStock"
                className="mr-2"
              />
              <label htmlFor="outOfStock" className="text-sm font-medium">
                Out of Stock
              </label>
            </div>
          </div>
        </Form.Item>

        {/* Description */}
        <Form.Item
          label={
            <span className="text-[#A7997D] font-medium">Description *</span>
          }
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea
            rows={4}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            className="rounded-[8px] border border-[#D9D9D9] bg-white"
          />
        </Form.Item>

        {/* Product Main Image */}
        <Form.Item
          label={
            <span className="text-[#A7997D] font-medium">Product Images *</span>
          }
          name="productImage"
          rules={[{ required: true, message: "Please upload product images" }]}
        >
          <div className="space-y-4">
            {/* Previews */}
            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative w-[200px] h-[200px] border border-[#D1D5DC] rounded-lg overflow-hidden"
                  >
                    <Image
                      width={200}
                      height={200}
                      src={url}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload always visible */}
            <div className="border border-[#D1D5DC] rounded-lg p-6 text-center">
              <p className="text-gray-600 mt-2 items-center justify-center flex flex-col">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="24"
                  viewBox="0 0 26 24"
                  fill="none"
                >
                  <path
                    d="M17.3339 16.0014L13.0006 12.0014M13.0006 12.0014L8.66723 16.0014M13.0006 12.0014V21.0014M22.0897 18.3914C23.1463 17.8597 23.9811 17.0183 24.4621 16.0001C24.9431 14.9818 25.0431 13.8447 24.7463 12.7681C24.4494 11.6916 23.7727 10.737 22.8228 10.0549C21.8729 9.37283 20.704 9.00218 19.5006 9.00145H18.1356C17.8077 7.83069 17.1965 6.74378 16.348 5.82244C15.4995 4.9011 14.4358 4.1693 13.2368 3.68206C12.0379 3.19481 10.7348 2.96481 9.42569 3.00933C8.11656 3.05385 6.83539 3.37175 5.67851 3.93911C4.52163 4.50648 3.51914 5.30855 2.74641 6.28503C1.97368 7.26151 1.45081 8.38698 1.21713 9.57684C0.983443 10.7667 1.04501 11.99 1.39722 13.1547C1.74942 14.3194 2.38308 15.3953 3.25057 16.3014"
                    stroke="#2E2E2E"
                    stroke-width="1.40075"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{" "}
                Drop files or browse
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Format: jpeg, png, gif • Max size: 25MB
              </p>

              <Upload
                multiple
                accept=".png,.jpg,.jpeg,.gif"
                beforeUpload={() => false}
                onChange={handleProductImageChange}
                showUploadList={false}
                className="mt-2"
              >
                <button className="bg-[#CA3634] hover:bg-[#9a5d00] text-white px-4 py-1 text-sm rounded-md">
                  Browse Files
                </button>
              </Upload>
            </div>
          </div>
        </Form.Item>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#AF6900] hover:bg-[#9a5d00] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      </Form>
    </div>
  );
}
