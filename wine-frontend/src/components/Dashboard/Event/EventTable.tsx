/* eslint-disable @typescript-eslint/no-unused-vars */
// components/dashboard/SubscriptionTable.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Table, Dropdown, Button, Tag } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useDeleteEventMutation, useGetEventListQuery } from "@/redux/service/admin/eventApi";
import Swal from "sweetalert2";

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
// Main Component
// --------------------
const EventTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const { data: eventsData, isLoading } = useGetEventListQuery();
  const [deleteEvent] = useDeleteEventMutation();

  // --------------------
  // Delete Event Handler
  // --------------------
  const handleDelete = async (eventId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AF6900',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteEvent(eventId).unwrap();
        if (res.status === true) {
          Swal.fire('Deleted!', 'The event has been deleted.', 'success');
        } else {
          Swal.fire('Error', 'Failed to delete event.', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete event.', 'error');
      }
    }
  };

  // --------------------
  // Calculate event status based on dates
  // --------------------
  const getStatus = (startDate: string, endDate: string): Event['status'] => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "Up-coming";
    if (now >= start && now <= end) return "Running";
    return "Complete";
  };
  const handleEdit = (record: Event) => {
    const eventId = record.key;
    window.location.href = `/dashboard/event/${eventId}`;
  };

  // --------------------
  // Map API response to table format
  // --------------------
  const mapApiDataToTable = (apiData: any[]): Event[] => {
    return apiData.map((item) => ({
      key: item.id,
      eventName: item.name || "N/A",
      startDate: item.startDate ? new Date(item.startDate).toLocaleDateString() : "N/A",
      audienceSize: Number(item.audienceSize) || 0,
      price: Number(item.price) || 0,
      duration: item.startDate && item.endDate
        ? `${Math.ceil((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (1000 * 60 * 60 * 24))} day`
        : "N/A",
      status: getStatus(item.startDate, item.endDate),
    }));
  };

  const events: Event[] = eventsData?.data?.products ? mapApiDataToTable(eventsData.data.products) : [];

  // --------------------
  // Render Status Badge
  // --------------------
  const renderStatusTag = (status: Event['status']) => {
    let color = 'default';
    if (status === 'Running') color = 'green';
    if (status === 'Up-coming') color = 'blue';
    if (status === 'Complete') color = 'gray';
    return <Tag color={color}>{status}</Tag>;
  };

  // --------------------
  // Table Columns
  // --------------------
  const columns = [
    { title: "Event Name", dataIndex: "eventName", key: "eventName", width: 200, render: (text: string) => <span className="font-medium">{text}</span> },
    { title: "Start Date", dataIndex: "startDate", key: "startDate", width: 150 },
    { title: "Audience Size", dataIndex: "audienceSize", key: "audienceSize", width: 120 },
    { title: "Price $", dataIndex: "price", key: "price", width: 100, render: (price: number) => <span>${price}</span> },
    { title: "Duration", dataIndex: "duration", key: "duration", width: 100 },
    { title: "Event Status", dataIndex: "status", key: "status", width: 120, render: renderStatusTag },
    {
      title: "Actions",
      key: "action",
      width: 80,
      render: (_: any, record: Event) => (
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: "Edit", onClick: () => handleEdit(record) },
              { key: "delete", label: "Delete", danger: true, onClick: () => handleDelete(record.key) },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // --------------------
  // Render
  // --------------------
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#A7997D]">Event</h2>
        <Link href="/dashboard/event/add-event" className="bg-[#AF6900] hover:bg-[#8d7c68] text-white px-4 py-2 rounded-[14px] text-sm font-medium flex items-center space-x-1 transition-colors">
          <span>+</span>
          <span>Add Event</span>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={events}
          columns={columns}
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: events.length,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            position: ['bottomCenter'],
            hideOnSinglePage: false,
          }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
          className="w-full"
        />
      </div>

      {/* --- Global Styles --- */}
      <style jsx global>{`
        .custom-recent-bookings-card .ant-table-thead > tr > th {
          background-color: #f5f5f5 !important;
          color: #333 !important;
          font-weight: 600 !important;
          border: 1px solid #e5e7eb !important;
          padding: 12px 16px !important;
          font-size: 14px !important;
        }
        .custom-recent-bookings-card .ant-table-tbody > tr > td {
          padding: 12px 16px !important;
          border-bottom: 1px solid #f0f0f0;
        }
        .custom-recent-bookings-card .ant-table-tbody > tr:hover > td {
          background-color: #fafafa !important;
        }
        .custom-recent-bookings-card .ant-pagination {
          display: flex !important;
          justify-content: center !important;
          margin-top: 16px !important;
        }
      `}</style>
    </div>
  );
};

export default EventTable;
