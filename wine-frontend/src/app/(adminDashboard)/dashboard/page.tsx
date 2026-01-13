// app/page.tsx
"use client";

import RecentActivity from "@/components/Dashboard/RecentActivity";
import RecentBookingsTable from "@/components/Dashboard/RecentBookingsTable";
import RevenueChart from "@/components/Dashboard/RevenueChart";
import StatCards from "@/components/Dashboard/StatCards";
import { useState } from "react";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-[#F4F7FD] p-10">
      {/* Stat Cards */}
      <div className="mb-6">
        <StatCards />
      </div>

      {/* Revenue Chart */}
<div className="mb-10 flex flex-col items-center md:flex-row w-full">
  <div className="w-full md:w-7/10">
    <RevenueChart />
  </div>
  <div className="w-full md:w-3/10">
    <RecentActivity />
  </div>
</div>
      {/* Recent Bookings Table */}
      <div>
        <RecentBookingsTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}