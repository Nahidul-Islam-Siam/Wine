/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/RevenueChart.tsx

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { useState } from 'react';

/** Interface for chart data */
interface ChartData {
  date: string;
  order: number;
  store: number;
}

// Mock data based on your image
const generateChartData = (timeRange: 'daily' | 'weekly' | 'monthly'): ChartData[] => {
  return [
    { date: 'Nov 01', order: 280, store: 500 },
    { date: 'Nov 02', order: 350, store: 800 },
    { date: 'Nov 03', order: 450, store: 600 },
    { date: 'Nov 04', order: 600, store: 300 },
    { date: 'Nov 05', order: 400, store: 650 },
    { date: 'Nov 06', order: 500, store: 550 },
    { date: 'Nov 07', order: 550, store: 400 },
  ];
};

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const chartData = generateChartData(timeRange);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#A7997D]">Order Status</h2>
        <div className="flex space-x-4">
          {(['daily', 'weekly', 'monthly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            {/* Only horizontal grid lines */}
            <CartesianGrid stroke="#F0F0F0" horizontal={true} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{
                fontSize: 12,
                fill: '#6B7280',
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[100, 1000]}
              ticks={[100, 300, 600, 1000]}
              tick={{
                fontSize: 12,
                fill: '#6B7280',
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
<Legend
  wrapperStyle={{
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '10px',
  }}
  iconType="circle"
  iconSize={6}
  align="center"
  verticalAlign="top"
  layout="horizontal"
/>

<Line
  type="monotone"
  dataKey="order"
  name="Order"
  stroke="#DC2626"
  strokeWidth={2}
  dot={false}
/>
<Line
  type="monotone"
  dataKey="store"
  name="Store"
  stroke="#2563EB"
  strokeWidth={2}
  dot={false}
/>
            {/* Red Line for Order */}
            <Line
              type="monotone"
              dataKey="order"
              stroke="#DC2626"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            {/* Blue Line for Store */}
            <Line
              type="monotone"
              dataKey="store"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            {/* Area Fill Under Lines */}
            <Area
              type="monotone"
              dataKey="order"
              stroke="#DC2626"
              fill="#FEE2E2"
              fillOpacity={0.3}
              strokeWidth={0}
            />
            <Area
              type="monotone"
              dataKey="store"
              stroke="#2563EB"
              fill="#DBEAFE"
              fillOpacity={0.3}
              strokeWidth={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}