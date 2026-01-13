/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronDown, X, Check } from "lucide-react";
import Image from "next/image";
import ProductCard from "../cards/ProductCard";
import { ProductQueryParams, useGetProductListQuery } from "@/redux/service/admin/productApi";
import { useGetCategoryListQuery } from "@/redux/service/admin/categoryApi";
import { useGetBrandListQuery } from "@/redux/service/admin/brandApi";
import { useGetSizeListQuery } from "@/redux/service/admin/bottleSizeApi";
import { useSearchParams } from "next/navigation";

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedBottleSizes, setSelectedBottleSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("best-offer");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { data: categoriesResponse } = useGetCategoryListQuery();
  const { data: sizeData } = useGetSizeListQuery();
  const { data: brandsResponse } = useGetBrandListQuery();

  const categories = categoriesResponse?.data?.category || [];
  const itemsPerPage = 12;
  const searchParams = useSearchParams();

  // Sync URL → State
  useEffect(() => {
    const query = searchParams;

    if (query.get("search")) {
      setSearchQuery(query.get("search") || "");
    }

    const minPrice = Number(query.get("minPrice")) || 0;
    const maxPrice = Number(query.get("maxPrice")) || 500;
    setPriceRange([minPrice, maxPrice]);

    if (query.get("categoryId")) {
      setSelectedCategories([query.get("categoryId")!]);
    } else {
      setSelectedCategories([]);
    }

    if (query.get("brandId")) {
      setSelectedBrands([query.get("brandId")!]);
    } else {
      setSelectedBrands([]);
    }

    if (query.get("sortBy")) {
      setSortBy(query.get("sortBy") || "best-offer");
    }

    const pageFromUrl = Number(query.get("page")) || 1;
    setCurrentPage(pageFromUrl);
  }, [searchParams]);

  // Build API params
  const currentSearchParams: ProductQueryParams = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    minPrice: priceRange[0] > 0 ? String(priceRange[0]) : undefined,
    maxPrice: priceRange[1] < 500 ? String(priceRange[1]) : undefined,
    categoryId: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
    brandId: selectedBrands.length > 0 ? selectedBrands[0] : undefined,
    ...(sortBy === "best-offer" ? { hasDiscount: "true" } : {}),
    sortBy: sortBy === "best-offer" ? undefined : "price",
    sortOrder: sortBy === "price-low" ? "asc" : sortBy === "price-high" ? "desc" : undefined,
  };

  const { data: productsData, isLoading, isError } = useGetProductListQuery(currentSearchParams);

  // State → URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < 500) params.set("maxPrice", String(priceRange[1]));
    if (selectedCategories[0]) params.set("categoryId", selectedCategories[0]);
    if (selectedBrands[0]) params.set("brandId", selectedBrands[0]);
    if (sortBy !== "best-offer") params.set("sortBy", sortBy);
    if (currentPage > 1) params.set("page", String(currentPage));

    const queryString = params.toString();
    const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [searchQuery, priceRange, selectedCategories, selectedBrands, sortBy, currentPage]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange, selectedBrands, searchQuery, sortBy]);

  // Toggle functions
  const toggleCategory = (categoryId: string) => {
    if (categoryId === "all") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
      );
    }
  };

  const toggleBottleSize = (size: string) => {
    setSelectedBottleSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]
    );
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Derived from API
  const totalCount = productsData?.data?.total || 0;
  const totalPages = productsData?.data?.totalPages || 1;
  const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  // Categories with count (approximate)
  const CATEGORIES = useMemo(() => {
    return [
      { id: "all", name: "All Categories", count: totalCount },
      ...categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: 0, // real count requires backend enhancement
      })),
    ];
  }, [categories, totalCount]);

  // Reusable Price Filter Component
  const PriceFilter = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={isMobile ? "bg-gray-50 p-4 rounded-lg" : ""}>
      <h3 className="font-bold text-[#482817] mb-4">Price</h3>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-400"
          />
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-400 ${
              isMobile ? "mt-2" : ""
            }`}
          />
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <span>Range: </span>
        <span className="font-medium">${priceRange[0]} – ${priceRange[1]}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="w-full bg-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Filters & Categories</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters (Sidebar) */}
          <aside className="hidden lg:block lg:w-64 space-y-6">
            {/* Categories */}
            <div className="">
              <h3 className="text-base font-medium md:text-xl text-[#482817] mb-4">Categories</h3>
              <div className="">
                {CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                      category.id === "all"
                        ? selectedCategories.length === 0
                          ? "bg-orange-100 text-orange-800"
                          : "hover:bg-gray-50"
                        : selectedCategories.includes(category.id)
                        ? "bg-orange-50 border-l-4 border-orange-400"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className="text-sm md:text-base font-normal text-[#968F8F]">{category.name}</span>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-sm text-[#968F8F]">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <PriceFilter />

            {/* Bottle Sizes */}
            <div className="">
              <h3 className="text-base font-medium md:text-xl text-[#482817] mb-4">Bottle Sizes</h3>
              <div className="grid grid-cols-4 gap-2">
                {sizeData?.data?.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => toggleBottleSize(size.name)}
                    className={`px-2 py-4 text-xs rounded border transition-colors ${
                      selectedBottleSizes.includes(size.name)
                        ? "bg-orange-400 text-white border-orange-400"
                        : "text-gray-700 border-gray-300 hover:border-orange-300"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className=" ">
              <h3 className="text-base font-medium md:text-xl text-[#482817] mb-4">Select Brands</h3>
              <div className="grid grid-cols-3 gap-3">
                {brandsResponse?.data?.brand.map((brand) => (
                  <button
                    key={brand.id} // ✅ Use brand.id
                    onClick={() => toggleBrand(brand.id)} // ✅ FIXED!
                    className={`border-2 rounded-lg transition-all ${
                      selectedBrands.includes(brand.id)
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={brand.img || "/images/brand-1.png"}
                      alt={brand.name}
                      width={100}
                      height={100}
                      className="w-full h-auto"
                    />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Filters (Slide-in) */}
          {mobileFiltersOpen && (
            <>
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#482817]">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-4 space-y-6">
                  {/* Categories */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-[#482817] mb-4">Categories</h3>
                    <div className="space-y-3">
                      {CATEGORIES.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`mobile-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="w-4 h-4 text-orange-400 border-gray-300 rounded focus:ring-orange-400 cursor-pointer"
                          />
                          <label
                            htmlFor={`mobile-${category.id}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <PriceFilter isMobile={true} />

                  {/* Bottle Size */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-[#482817] mb-4">Bottle Size</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {sizeData?.data?.sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => toggleBottleSize(size.name)}
                          className={`px-2 py-1.5 text-xs rounded border transition-colors ${
                            selectedBottleSizes.includes(size.name)
                              ? "bg-orange-400 text-white border-orange-400"
                              : "bg-white text-gray-700 border-gray-300 hover:border-orange-300"
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-[#482817] mb-4">Select Brands</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {brandsResponse?.data?.brand.map((brand) => (
                        <button
                          key={brand.id} // ✅
                          onClick={() => toggleBrand(brand.id)} // ✅ FIXED!
                          className={`border-2 rounded-lg p-2 transition-all ${
                            selectedBrands.includes(brand.id)
                              ? "border-orange-400 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Image
                            src={brand.img || "/images/brand-1.png"}
                            alt={brand.name}
                            width={60}
                            height={60}
                            className="w-full h-auto"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full bg-orange-400 text-white py-3 rounded-lg font-medium hover:bg-orange-500 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </aside>
            </>
          )}

          {/* Main Content */}
          <main className="flex-1">
            <div className="p-4 rounded-lg mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xl md:text-2xl font-semibold text-[#968F8F]">
                  Showing {startIndex}–{Math.min(startIndex + itemsPerPage - 1, totalCount)} of {totalCount} item(s)
                </div>

                <div className="py-4 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto">
                    {/* Search + Sort */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
                      {/* Search */}
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-3 py-2 w-full bg-transparent border border-[#DEEDE2] rounded-[4px] text-gray-700 placeholder:text-gray-400 outline-none focus:outline-none focus:ring-2 focus:border-[#DEEDE2]"
                        />
                      </div>

                      {/* Sort */}
                      <div className="relative w-full sm:w-40">
                        <button
                          onClick={() => toggleDropdown("sort")}
                          className="w-full px-3 py-2 border border-[#DEEDE2] rounded-[4px] text-sm text-gray-700 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2"
                        >
                          <span>Sort by</span>
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        </button>

                        {activeDropdown === "sort" && (
                          <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            {[
                              { key: "best-offer", label: "Best Offer" },
                              { key: "price-low", label: "Price Low" },
                              { key: "price-high", label: "Price High" },
                            ].map((opt) => (
                              <button
                                key={opt.key}
                                onClick={() => {
                                  setSortBy(opt.key);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Dropdowns */}
                    <div className="flex flex-wrap gap-3">
                      {/* Brand */}
                      <div className="relative w-full sm:w-32">
                        <button
                          onClick={() => toggleDropdown("brand")}
                          className="w-full px-3 py-2 border border-[#DEEDE2] rounded-[4px] flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 text-sm text-gray-700"
                        >
                          <span>
                            {selectedBrands.length === 0
                              ? "Brand"
                              : brandsResponse?.data?.brand.find((b) => b.id === selectedBrands[0])?.name || "Brand"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        </button>

                        {activeDropdown === "brand" && (
                          <div className="absolute top-full mt-1 w-full bg-white border border-[#DEEDE2] rounded-md shadow-lg z-10">
                            <button
                              onClick={() => {
                                setSelectedBrands([]);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              All Brands
                            </button>
                            {brandsResponse?.data?.brand.map((brand) => (
                              <button
                                key={brand.id}
                                onClick={() => {
                                  setSelectedBrands([brand.id]);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Image
                                  src={brand.img || "/images/brand-1.png"}
                                  alt={brand.name}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 object-contain"
                                />
                                {brand.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Category */}
                      <div className="relative w-full sm:w-40">
                        <button
                          onClick={() => toggleDropdown("categories")}
                          className="w-full px-3 py-2 border border-[#DEEDE2] rounded-[4px] flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 text-sm text-gray-700"
                        >
                          <span>Categories</span>
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        </button>
                        {activeDropdown === "categories" && (
                          <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            <div className="p-3">
                              {CATEGORIES.map((cat) => (
                                <label
                                  key={cat.id}
                                  className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50"
                                >
                                  <div
                                    className={`w-4 h-4 border rounded flex items-center justify-center ${
                                      selectedCategories.includes(cat.id)
                                        ? "bg-[#EA1E1E] border-[#EA1E1E]"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {selectedCategories.includes(cat.id) && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <span className="text-sm">{cat.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottle Size */}
                      <div className="relative w-full sm:w-36">
                        <button
                          onClick={() => toggleDropdown("bottleSize")}
                          className="w-full px-3 py-2 border border-[#DEEDE2] rounded-[4px] flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 text-sm text-gray-700"
                        >
                          <span>Bottle Size</span>
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        </button>
                        {activeDropdown === "bottleSize" && (
                          <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            <button
                              onClick={() => {
                                setSelectedBottleSizes([]);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              All Sizes
                            </button>
                            {sizeData?.data?.sizes.map((size) => (
                              <button
                                key={size.id}
                                onClick={() => {
                                  toggleBottleSize(size.name);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                              >
                                {size.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[300px]">
  {isLoading ? (
    // Optional: show skeleton loaders
    Array.from({ length: itemsPerPage }).map((_, i) => (
      <div key={i} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
    ))
  ) : productsData?.data?.products && productsData.data.products.length > 0 ? (
    productsData.data.products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))
  ) : (
    <div className="col-span-full flex items-center justify-center">
      <p className="text-gray-500 text-lg py-12">No products found matching your filters.</p>
    </div>
  )}
</div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3 && i === 4) {
                    pageNum = totalPages;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-md border ${
                        currentPage === pageNum
                          ? "bg-orange-400 text-white border-orange-400"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}