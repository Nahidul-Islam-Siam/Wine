"use client"

import { useState } from "react"
import CategoryFilter from "./CategoryFilter"
import ProductCard from "./ProductCard"
import { useRouter } from "next/navigation"
// import { products } from "./ProductsDummyData"
import { useGetProductListQuery } from "@/redux/service/admin/productApi"
import { useGetCategoryListQuery } from "@/redux/service/admin/categoryApi"
import Loaders from "@/lib/providers/Loaders"

// const categories = ["All", "Rosé Wines", "Sparkling", "Red Wines", "White Wines"]



export default function CategorYSection() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [visibleCount, setVisibleCount] = useState(8)

const router = useRouter()
const { data: categoriesResponse, isLoading} = useGetCategoryListQuery();
const categories = categoriesResponse?.data?.category || []

const categoryMap = categories.reduce((acc, cat) => {
  acc[cat.name] = cat.id
  return acc
}, {} as Record<string, string>)

const selectedCategoryId =
  activeCategory === "All" ? undefined : categoryMap[activeCategory]

const { data: productsData } = useGetProductListQuery({
  categoryId: selectedCategoryId,
})

const categoryNames = ["All", ...categories.map((cat) => cat.name)]

// Filter (you can improve later)
const filteredProducts = productsData?.data.products || []
const visibleProducts = filteredProducts.slice(0, visibleCount)

const handleLoadMore = () => {
  if (visibleCount === 8) {
    setVisibleCount(12)
  }
}

  // Handle URL Search Params


  const handleSeeAll = () => {
    router.push("/shop")   // <-- redirect page
  }

  const hasMore = filteredProducts.length > 12
  if(isLoading) {
    return (
   <Loaders/>
    )
  }
  return (
<main className="min-h-[calc(100svh)] container mx-auto py-12 md:py-24">

      {/* Header */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 mx-auto">
        <h1 className="text-4xl font-extrabold font-abhaya text-center text-[#6D0E0B] md:text-[48px] mb-8">
          Shop By Category
        </h1>

        <CategoryFilter
          categories={categoryNames}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Products Grid */}
      <div className="py-12 px-4 sm:px-6   mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-10">
          {/* SHOW LOAD MORE when visibleCount == 8 */}
          {visibleCount === 2 && (
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-[#6D0E0B] text-white rounded-md hover:bg-[#540b08] transition"
            >
              Load More
            </button>
          )}

          {/* SHOW SEE ALL when visibleCount == 12 & more products exist */}
          {visibleCount === 4 && hasMore && (
            <button
              onClick={handleSeeAll}
              className="px-6 py-2 bg-[#6D0E0B] text-white rounded-md hover:bg-[#540b08] transition"
            >
              See All
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
