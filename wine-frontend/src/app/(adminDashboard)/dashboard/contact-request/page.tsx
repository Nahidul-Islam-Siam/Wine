/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Button, Modal } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

// --------------------
// Interfaces
// --------------------
interface ContactMessage {
  key: string;
  userName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

// --------------------
// Mock Data
// --------------------
const mockContactMessages: ContactMessage[] = [
  { key: "1", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "2", userName: "Jane Smith", email: "jane@gmail.com", phoneNumber: "088 3343 32438", message: "Can I get a refund for my unused classes?" },
  { key: "3", userName: "Alex Johnson", email: "alex@gmail.com", phoneNumber: "088 3343 32439", message: "Do you offer private yoga sessions?" },
  { key: "4", userName: "Sam Wilson", email: "sam@gmail.com", phoneNumber: "088 3343 32440", message: "Is there parking available near the studio?" },
  { key: "5", userName: "Taylor Swift", email: "taylor@gmail.com", phoneNumber: "088 3343 32441", message: "I'm interested in a group wellness retreat." },
  { key: "6", userName: "Chris Lee", email: "chris@gmail.com", phoneNumber: "088 3343 32442", message: "What time does the morning session start?" },
  { key: "7", userName: "Morgan Frey", email: "morgan@gmail.com", phoneNumber: "088 3343 32443", message: "Can I reschedule my appointment?" },
  { key: "8", userName: "Riley Adams", email: "riley@gmail.com", phoneNumber: "088 3343 32444", message: "Are masks required during class?" },
  { key: "9", userName: "Jamie Fox", email: "jamie@gmail.com", phoneNumber: "088 3343 32445", message: "Do you have showers at the facility?" },
  { key: "10", userName: "Casey King", email: "casey@gmail.com", phoneNumber: "088 3343 32446", message: "Can I bring a guest to try a class?" },
];

// --------------------
// Main Component
// --------------------
const ContactUsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const pageSize = 5; // Show 5 messages per page

  const displayedData = useMemo(() => mockContactMessages, []);
  const total = displayedData.length;

  const handlePageChange = (page: number) => setCurrentPage(page);

  const openMessageModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  // Paginate data
  const paginatedData = displayedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Us</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                User Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr key={item.key} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.userName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.phoneNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={item.message}>
                  {item.message}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => openMessageModal(item)}
                      className="text-gray-500 hover:text-[#A7997D]"
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => console.log('Delete message:', item.key)}
                      className="text-gray-500 hover:text-red-600"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6">
        <div className="flex items-center space-x-1">
          {/* Previous */}
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded text-lg ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            ‹
          </button>

          {/* Page Numbers (max 5 visible) */}
          {Array.from({ length: Math.min(5, Math.ceil(total / pageSize)) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 flex items-center justify-center rounded text-sm font-medium
                  ${currentPage === page
                    ? 'bg-[#A7997D] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next */}
          <button
            onClick={() => handlePageChange(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
            disabled={currentPage === Math.ceil(total / pageSize)}
            className={`w-10 h-10 flex items-center justify-center rounded text-lg ${
              currentPage === Math.ceil(total / pageSize)
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            ›
          </button>
        </div>
      </div>

      {/* Message View Modal */}
      <Modal
        open={isModalOpen}
        onCancel={closeMessageModal}
        footer={null}
        width={600}
        centered
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Message Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedMessage?.message}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <Button
              className="bg-[#A7997D] hover:bg-[#8d7c68] text-white justify-center flex items-center px-4 py-2 rounded-md font-medium"
              onClick={() => console.log('Reply to:', selectedMessage?.key)}
            >
              Reply
            </Button>
       
          </div>
        </div>
      </Modal>

      {/* --- Global Style: Match Booking Table Exactly --- */}
      <style jsx global>{`
        /* Table Header (match RecentBookingsTable) */
        .custom-recent-bookings-card .ant-table-thead > tr > th,
        .custom-recent-bookings-card table thead tr th {
          background-color: #d2d6d8 !important;
          color: #333 !important;
          font-weight: 600 !important;
          border: 2px solid #d2d6d8 !important;
          padding: 16px !important;
        }

        .custom-recent-bookings-card table thead tr:first-child th:first-child {
          border-top-left-radius: 8px;
        }

        .custom-recent-bookings-card table thead tr:first-child th:last-child {
          border-top-right-radius: 8px;
        }

        /* Table Body */
        .custom-recent-bookings-card table tbody tr:hover td {
          background-color: #f9fafb !important;
        }

        /* Pagination Styling */
        .custom-recent-bookings-card .ant-pagination-item-active {
          background-color: #a7997d !important;
          border-color: #a7997d !important;
        }

        .custom-recent-bookings-card .ant-pagination-item-active a {
          color: white !important;
        }

        .custom-recent-bookings-card .ant-pagination-item a,
        .custom-recent-bookings-card .ant-pagination-item-link {
          color: black !important;
        }

        .custom-recent-bookings-card .ant-pagination-item:hover a,
        .custom-recent-bookings-card .ant-pagination-item-link:hover {
          color: #8d7c68 !important;
          border-color: #8d7c68 !important;
        }
      `}</style>
    </div>
  );
};

export default ContactUsPage;