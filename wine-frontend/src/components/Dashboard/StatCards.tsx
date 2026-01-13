"use client";

import { useGetStatsDataQuery } from "@/redux/service/admin/dashboardApi";
import { useState, useMemo } from "react";

type FilterType = "all" | "year" | "month" | "custom";

export default function StatCards() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-based

  // Generate years (e.g., 2020–2030)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i); // ±5 years
  }, []);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Build query params based on filter
const queryParams =
  filter === "year"
    ? { year: new Date().getFullYear() }
    : filter === "month"
    ? { month: new Date().toISOString().slice(0, 7) }
    : filter === "custom"
    ? { month: `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}` }
    : undefined;
  const { data, isLoading } = useGetStatsDataQuery(queryParams);

  const stats = data?.data;

  if (isLoading) {
    return <p className="text-center py-10">Loading stats...</p>;
  }

  return (
    <div className="w-full mb-8">
      {/* HEADER + FILTER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">Dashboard Stats</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Main Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
            <option value="custom">Custom</option>
          </select>

          {/* Year Picker (only when custom) */}
          {filter === "custom" && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded-md px-3 py-1 text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}

          {/* Month Picker (only when custom) */}
          {filter === "custom" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border rounded-md px-3 py-1 text-sm"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* CARDS */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <StatCard
          title="Total Earnings"
          value={stats?.totalEarnings.entireTotal}
          change={stats?.totalEarnings.change}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders.entireTotal}
          change={stats?.totalOrders.change}
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers.entireTotal}
          change={stats?.totalCustomers.change}
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts.entireTotal}
          change={stats?.totalProducts.change}
        />
      </div>
    </div>
  );
}

/* ================= STAT CARD COMPONENT ================= */
function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value?: string | number;
  change?: number;
}) {
  return (
    <div className="p-5 rounded-[8px] border-r-[1.5px] border-r-[#AF6900] bg-white shadow-sm min-w-[200px] flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xs md:text-base font-medium text-[#968F8F] uppercase">
            {title}
          </h3>
          <p className="md:text-2xl text-xl font-semibold font-poppins text-[#482817]">
            {value ?? "--"}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="bg-[#AF6900] flex items-center gap-1 text-white text-xs px-2 py-1 rounded-full">
          {change ?? 0}%
        </span>
      </div>
    </div>
  );
}