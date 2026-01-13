// components/dashboard/SubscriptionTable.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Table, Dropdown, Menu, Button, Tag } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Link from "next/link";

// --------------------
// Interfaces
// --------------------
interface Event {
  key: string;
  eventName: string;
  startDate: string;
  audienceSize: number;
  price: number;
  duration: string;
  status: 'Running' | 'Up-coming' | 'Complete';
}

// --------------------
// Mock Data (Only Events)
// --------------------
const mockEventData: Event[] = [
  { key: "1", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Running" },
  { key: "2", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Up-coming" },
  { key: "3", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Complete" },
  { key: "4", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Running" },
  { key: "5", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Running" },
  { key: "6", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Running" },
  { key: "7", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Running" },
  { key: "8", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Running" },
  { key: "9", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Running" },
  { key: "10", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Running" },
  { key: "11", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Running" },
  { key: "12", eventName: "Wine Garden Tour", startDate: "12/12/2025", audienceSize: 100, price: 199, duration: "3 day", status: "Running" },
];

// --------------------
// Action Menu
// --------------------
const ActionMenu: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => (
  <Menu>
    <Menu.Item key="edit" onClick={onEdit}>Edit</Menu.Item>
    <Menu.Item key="delete" danger onClick={onDelete}>Delete</Menu.Item>
  </Menu>
);

// --------------------
// Main Component (Event Only)
// --------------------
const EventTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Render Status Badge
  const renderStatusTag = (status: Event['status']) => {
    let color = 'default';
    if (status === 'Running') color = 'green';
    if (status === 'Up-coming') color = 'blue';
    if (status === 'Complete') color = 'gray';

    return <Tag color={color}>{status}</Tag>;
  };

  const columns = [
    {
      title: "Event Name",
      dataIndex: "eventName",
      key: "eventName",
      width: 200,
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
    },
    {
      title: "Audience Size",
      dataIndex: "audienceSize",
      key: "audienceSize",
      width: 120,
    },
    {
      title: "Price $",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price: number) => <span>${price}</span>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 100,
    },
    {
      title: "Event Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: renderStatusTag,
    },
    {
      title: "Actions",
      key: "action",
      width: 80,
      render: (_: any, record: Event) => (
        <Dropdown
          overlay={
            <ActionMenu
              onEdit={() => console.log("Edit", record.key)}
              onDelete={() => console.log("Delete", record.key)}
            />
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#AF6900]">Event</h2>
       {/* Add Product Button */}
        <Link href="/dashboard/event/add-event" className="bg-[#AF6900] hover:bg-[#8d7c68] text-white px-4 py-2 rounded-[14px] text-sm font-medium flex items-center space-x-1 transition-colors">
          <span>+</span>
          <span>Add Event</span>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={mockEventData}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: mockEventData.length,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            position: ['bottomCenter'], // Centered pagination
            hideOnSinglePage: true,
          }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
          className="w-full"
        />
      </div>

      {/* --- Global Style Copied from Booking Table --- */}
      <style jsx global>{`
        /* Match exactly with RecentBookingsTable */

        .custom-recent-bookings-card .ant-card-head {
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

        .custom-recent-bookings-card .ant-card-head-title {
          color: #a7997d !important;
          font-weight: 600 !important;
          font-size: 18px !important;
        }

        /* Table Header */
        .custom-recent-bookings-card .ant-table-thead > tr > th {
          background-color: #f5f5f5 !important; /* Changed to light gray like image */
          color: #333 !important;
          font-weight: 600 !important;
          border: 1px solid #e5e7eb !important;
          padding: 12px 16px !important;
          font-size: 14px !important;
        }

        .custom-recent-bookings-card .ant-table-thead > tr:first-child > th:first-child {
          border-top-left-radius: 8px !important;
        }

        .custom-recent-bookings-card .ant-table-thead > tr:first-child > th:last-child {
          border-top-right-radius: 8px !important;
        }

        /* Table Body */
        .custom-recent-bookings-card .ant-table-tbody > tr > td {
          padding: 12px 16px !important;
          border-bottom: 1px solid #f0f0f0;
        }

        .custom-recent-bookings-card .ant-table-tbody > tr:hover > td {
          background-color: #fafafa !important;
        }

        /* Pagination Styling */
        .custom-recent-bookings-card .ant-pagination {
          display: flex !important;
          justify-content: center !important;
          margin-top: 16px !important;
        }

        .custom-recent-bookings-card .ant-pagination-item-link,
        .custom-recent-bookings-card .ant-pagination-item a {
          color: black !important;
          border-color: #a7997d !important;
        }

        .custom-recent-bookings-card .ant-pagination-item-active {
          background-color: #a7997d !important;
          border-color: #a7997d !important;
        }

        .custom-recent-bookings-card .ant-pagination-item-active a {
          color: white !important;
        }

        .custom-recent-bookings-card .ant-pagination-item:hover a,
        .custom-recent-bookings-card .ant-pagination-item-link:hover {
          color: #8d7c68 !important;
          border-color: #8d7c68 !important;
        }

        .custom-recent-bookings-card .ant-pagination-prev a,
        .custom-recent-bookings-card .ant-pagination-next a {
          color: black !important;
        }

        .custom-recent-bookings-card .ant-pagination-prev button:disabled,
        .custom-recent-bookings-card .ant-pagination-next button:disabled {
          border-color: #ddd !important;
          color: #ccc !important;
        }
      `}</style>
    </div>
  );
};

export default EventTable;