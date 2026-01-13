'use client';
import OrderList from "@/components/Dashboard/OrderList/OrderList";
import React, { useState } from "react";

export default function OrderPage() {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div>
      <OrderList currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}
