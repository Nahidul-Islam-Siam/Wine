// src/app/(adminDashboard)/dashboard/all-product/page.tsx
'use client';

import AllProductList from '@/components/Dashboard/All-Product/AllProductList';
import { useState } from 'react';

export default function AllProductPage() {
  // ✅ State lives INSIDE the page component
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-6">
      {/* ✅ Pass state to child component */}
      <AllProductList
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
    </div>
  );
}