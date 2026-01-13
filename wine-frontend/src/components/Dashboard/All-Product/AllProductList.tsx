/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, Table, Dropdown, Button, Modal, Skeleton, Input, Select, Switch } from "antd";
import { EllipsisOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useDeleteProductMutation, useGetProductByAdminQuery } from "@/redux/service/admin/productApi";
import Swal from "sweetalert2";
import { useGetCategoryListQuery } from "@/redux/service/admin/categoryApi";
import { useGetBrandListQuery } from "@/redux/service/admin/brandApi";

/** Interface for product data */
interface ProductRecord {
  key: string;
  id: string;
  productId: string;
  productName: string;
  brandName: string;
  category: string;
  totalProduct: number;
  totalSales: number;
  available: number;
  price: number;
  totalSalesAmount: number;
  images: string[];
}

/** Props interface */
interface AllProductListProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function AllProductList({
  currentPage,
  setCurrentPage,
}: AllProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteProduct] = useDeleteProductMutation();
  
  // 🔍 Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [brandId, setBrandId] = useState<string | undefined>(undefined);
  const [hasDiscount, setHasDiscount] = useState<boolean | undefined>(undefined);
  const [inStock, setInStock] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);

  // Fetch data
  const { data: categoriesData } = useGetCategoryListQuery();
  const { data: brandsData } = useGetBrandListQuery();

  const categories = categoriesData?.data?.category || [];
  const brands = brandsData?.data?.brand || [];

  // ✅ Build query params for admin API
  const queryParams = {
    page: 1, // We'll load all (or paginated) from API, but for now load all
    limit: 1000, // Load all for filtering (or use real pagination later)
    search: searchTerm || undefined,
    categoryId: categoryId || undefined,
    brandId: brandId || undefined,
    hasDiscount: hasDiscount !== undefined ? (hasDiscount ? "true" : "false") : undefined,
    inStock: inStock !== undefined ? (inStock ? "true" : "false") : undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
  };

  const {  data: productsByAdminResponse, isLoading } = useGetProductByAdminQuery(queryParams);

  // ✅ Transform admin products → ProductRecord
  const allTransformedProducts = useMemo(() => {
    if (!productsByAdminResponse?.data?.products) return [];
    
    return productsByAdminResponse.data.products.map((product) => ({
      key: product.id,
      id: product.id,
      productId: product.id,
      productName: product.name,
      brandName: product.brand.name,
      category: product.category.name,
      totalProduct: parseInt(product.quantity) || 0,
      // 👇 Use statistics from API
      totalSales: product.statistics.totalQuantitySold || 0,
      available: product.statistics.totalAvailable || 0,
      price: parseFloat(product.price) || 0,
      totalSalesAmount: product.statistics.totalRevenue || 0,
      images: product.images || [],
    }));
  }, [productsByAdminResponse]);

  // ✅ Frontend pagination (since we load all)
  const pageSize = 10;
  const totalPages = Math.ceil(allTransformedProducts.length / pageSize);
  const paginatedProducts = allTransformedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Modal handlers
  const showDetails = (record: ProductRecord) => {
    setSelectedProduct(record);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await deleteProduct(productId).unwrap();
      if (res.status === true) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: res.message || 'Product deleted successfully.',
          confirmButtonColor: '#AF6900',
          timer: 2000,
          showConfirmButton: false,  
        });
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'error',  
          title: 'Error',
          text: res.message || 'Failed to delete product.',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete product.',
        confirmButtonColor: '#d33',
      });
    }
    closeModal();
  };

  // Render Actions Menu
  const renderActions = (_: any, record: ProductRecord) => (
    <Dropdown
      menu={{
        items: [
          {
            key: "1",
            label: "View Details",
            onClick: () => showDetails(record),
          },
          { 
            key: "2", 
            label: "Edit",
            onClick: () => {
              window.location.href = `/dashboard/all-product/${record.id}`;
            }
          },
          {
            key: "3",
            label: "Delete",
            onClick: () => handleDeleteProduct(record.id),
            danger: true,
          },
        ],
      }}
      placement="bottomRight"
    >
      <Button type="text" icon={<EllipsisOutlined />} />
    </Dropdown>
  );

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
      width: 100,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: 180,
    },
    {
      title: "Brand Name",
      dataIndex: "brandName",
      key: "brandName",
      width: 180,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "Total Product",
      dataIndex: "totalProduct",
      key: "totalProduct",
      width: 100,
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
      width: 100,
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      width: 80,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 80,
      render: (price: number) => `$${price}`,
    },
    {
      title: "Total Sales",
      dataIndex: "totalSalesAmount",
      key: "totalSalesAmount",
      width: 100,
      render: (amount: number) => `$${amount}`,
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      render: renderActions,
    },
  ];

  if (isLoading) {
    return (
      <Card
        className="custom-all-product-card"
        title={<span className="text-lg font-semibold text-[#A7997D]">All Product</span>}
        style={{ borderRadius: "0", border: "none", backgroundColor: "transparent" }}
        styles={{ body: { padding: 0, backgroundColor: "transparent" } }}
      >
        <Skeleton active paragraph={{ rows: 5 }} />
      </Card>
    );
  }

  // if (isError || !productsByAdminResponse?.data) {
  //   return (
  //     <Card
  //       className="custom-all-product-card"
  //       title={<span className="text-lg font-semibold text-[#A7997D]">All Product</span>}
  //       style={{ borderRadius: "0", border: "none", backgroundColor: "transparent" }}
  //       styles={{ body: { padding: 20, backgroundColor: "transparent" } }}
  //     >
  //       <div className="text-center text-red-500">Failed to load products</div>
  //     </Card>
  //   );
  // }

  return (
    <>
      <Card
        className="custom-all-product-card"
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <span style={{ fontSize: "18px", color: "#A7997D", fontWeight: "600" }}>
              All Product
            </span>
          </div>
        }
        style={{ borderRadius: "0", border: "none", backgroundColor: "transparent", overflow: "visible" }}
        styles={{ body: { padding: 0, backgroundColor: "transparent" } }}
      >
        {/* 🔍 Filter Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />

            {/* Category */}
            <Select
              placeholder="Filter by Category"
              value={categoryId}
              onChange={(value) => setCategoryId(value || undefined)}
              allowClear
              options={categories.map((cat: any) => ({ label: cat.name, value: cat.id }))}
            />

            {/* Brand */}
            <Select
              placeholder="Filter by Brand"
              value={brandId}
              onChange={(value) => setBrandId(value || undefined)}
              allowClear
              options={brands.map((brand: any) => ({ label: brand.name, value: brand.id }))}
            />

            {/* Discount */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Has Discount</span>
              <Switch
                checked={hasDiscount === true}
                onChange={(checked) => setHasDiscount(checked ? true : false)}
                checkedChildren="Yes"
                unCheckedChildren="No"
              />
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">In Stock</span>
              <Switch
                checked={inStock === true}
                onChange={(checked) => setInStock(checked ? true : false)}
                checkedChildren="Yes"
                unCheckedChildren="No"
              />
            </div>

            {/* Sort */}
            <Select
              placeholder="Sort By"
              value={sortBy}
              onChange={(value) => {
                setSortBy(value || undefined);
                setSortOrder(value ? "desc" : undefined); // default desc
              }}
              allowClear
              options={[
                { label: "Price (High to Low)", value: "price" },
                { label: "Price (Low to High)", value: "price" },
                { label: "Name (A-Z)", value: "name" },
              ]}
            />
          </div>
        </div>

 
 <div style={{ overflowX: "auto", width: "100%" }}>
  <Table
    columns={columns}
    dataSource={paginatedProducts}
    pagination={false}
    scroll={{ x: 1000 }}
    locale={{ emptyText: "No products found matching your filters." }}
  />
</div>
    

        {/* Pagination */}
        <div className="custom-pagination">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </Button>

          {Array.from({ length: totalPages || 1 }).map((_, i) => (
            <Button
              key={i}
              type={currentPage === i + 1 ? "primary" : "default"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>

        {/* --- Global Styles --- */}
        <style jsx global>{`
          .ant-table-tbody {
            background-color: #fff !important;
          }

          .custom-all-product-card .ant-card-head {
            display: flex !important;
            justify-content: center !important;
            flex-direction: column !important;
            min-height: 40px !important;
            margin-bottom: -1px;
            background: transparent !important;
            border-bottom: 1px solid #f0f0f0 !important;
            border-radius: 10px 10px 0 0 !important;
            padding: 0px 0px !important;
          }

          .custom-all-product-card .ant-card-head-title {
            color: #a7997d !important;
            font-weight: 600 !important;
            font-size: 18px !important;
          }

          .custom-all-product-card .ant-table-thead > tr > th {
            background-color: #f5f5f5 !important;
            color: #333 !important;
            font-weight: 600 !important;
            border: 1px solid #e5e7eb !important;
            padding: 12px 16px;
            font-size: 14px;
          }

          .custom-all-product-card .ant-table-thead > tr:first-child > th:first-child {
            border-top-left-radius: 8px !important;
          }

          .custom-all-product-card .ant-table-thead > tr:first-child > th:last-child {
            border-top-right-radius: 8px !important;
          }

          .custom-all-product-card .ant-table-tbody > tr {
            border-bottom: 1px solid #e5e7eb !important;
          }

          .custom-all-product-card .ant-table-tbody > tr:hover {
            background-color: #fafafa !important;
          }

          .custom-pagination {
            display: flex;
            justify-content: end;
            gap: 8px;
            margin: 20px 0;
          }

          .custom-pagination .ant-btn-primary {
            background-color: #a7997d;
            border-color: #a7997d;
          }

          .custom-pagination .ant-btn-primary:hover {
            background-color: #8f8168;
            border-color: #8f8168;
          }
        `}</style>
      </Card>

      {/* Product Details Modal */}
      <Modal
        title={<h3 className="text-lg font-semibold text-gray-800">Product Details</h3>}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        centered
        width={600}
        styles={{
          body: {
            padding: "24px",
            backgroundColor: "#fff",
            borderRadius: "8px",
          },
        }}
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Image
                src={selectedProduct.images[0]  || "https://via.placeholder.com/128x128?text=No+Image"
          
                }
                width={128}
                height={128}
                alt="Product"
                className="w-32 h-32 object-contain rounded-md"
                style={{ border: "1px solid #e5e7eb", padding: "12px" }}
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Product Name</span>
                  <span className="text-gray-900">{selectedProduct.productName}</span>
                </div>
              </div>
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-[#A7997D]">Brand Name</span>
                  <span className="text-gray-900">{selectedProduct.brandName}</span>
                </div>
              </div>
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-[#A7997D]">Product Id</span>
                  <span className="text-gray-900">{selectedProduct.productId}</span>
                </div>
              </div>
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-[#A7997D]">Category</span>
                  <span className="text-gray-900">{selectedProduct.category}</span>
                </div>
              </div>
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-[#A7997D]">Total Product</span>
                  <span className="text-gray-900">{selectedProduct.totalProduct}</span>
                </div>
              </div>
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-[#A7997D]">Total Sales</span>
                  <span className="text-gray-900">{selectedProduct.totalSales}</span>
                </div>
              </div>
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-[#A7997D]">Available</span>
                  <span className="text-gray-900">{selectedProduct.available}</span>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex justify-between">
                  <span className="font-medium text-[#A7997D]">Price</span>
                  <span className="text-gray-900">${selectedProduct.price}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}