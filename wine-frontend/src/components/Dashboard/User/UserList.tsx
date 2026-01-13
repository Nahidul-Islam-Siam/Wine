/* eslint-disable @typescript-eslint/no-unused-vars */
// components/dashboard/UserList.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Table, Dropdown, Button, Spin, Tag } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import UserDetailsModal from "./UserDetailsModal";
import { useGetAllUsersListQuery } from "@/redux/service/admin/userApi";

// --------------------
// Interfaces (matching your API response)
// --------------------
interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  role: string;
  joinedDate: string;
  lastOrderDate: string | null;
  totalOrders: number;
}

interface UserTableItem {
  key: string;
  userId: string;
  name: string;
  address: string; // Note: API doesn't return address, so we'll show "N/A"
  phone: string;
  email: string;
  lastOrder: string;
  totalOrder: number;
  event: string;
  role: string;
}

// --------------------
// Main Component
// --------------------
const UserList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const { data: users, isLoading, isError } = useGetAllUsersListQuery();
  const pageSize = 10;

  // Transform API data to table format
  const tableData: UserTableItem[] = useMemo(() => {
    if (!users?.data?.users) return [];
    
    return users.data.users.map((user: User) => ({
      key: user.id,
      userId: user.id,
      name: user.name,
      address: "N/A", // API doesn't provide address
      phone: user.phone || "N/A",
      email: user.email,
      lastOrder: user.lastOrderDate ? new Date(user.lastOrderDate).toLocaleDateString('en-US') : "N/A",
      totalOrder: user.totalOrders,
      event: user.totalOrders > 0 ? "Booking" : "—",
      role: user.role,
    }));
  }, [users]);

  const openDetailsModal = (user: UserTableItem) => {
    // Find original user data for modal
    const originalUser = users?.data?.users.find(u => u.id === user.userId) || null;
    setSelectedUser(originalUser);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    { 
      title: "ID", 
      dataIndex: "userId", 
      key: "userId",
      width: 80,
      ellipsis: true,
    },
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name",
      width: 180,
    },
    { 
      title: "Address", 
      dataIndex: "address", 
      key: "address",
      width: 150,
      render: (text: string) => (
        <span className="text-gray-400">{text}</span>
      ),
    },
    { 
      title: "Phone", 
      dataIndex: "phone", 
      key: "phone",
      width: 150,
    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email",
      width: 200,
      ellipsis: true,
    },
    { 
      title: "Last Order", 
      dataIndex: "lastOrder", 
      key: "lastOrder",
      width: 120,
    },
    { 
      title: "Total Order", 
      dataIndex: "totalOrder", 
      key: "totalOrder",
      width: 100,
    },
    { 
      title: "Event", 
      dataIndex: "event", 
      key: "event",
      width: 100,
      render: (text: string) => (
        text === "—" ? <span className="text-gray-400">—</span> : <span>{text}</span>
      ),
    },
    {
      title: "Role",
      key: "role",
      width: 100,
      render: (_: any, record: UserTableItem) => (
        <Tag 
          color={record.role === "ADMIN" ? "red" : "blue"}
          className="font-medium"
        >
          {record.role}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_: any, record: UserTableItem) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'disable',
                danger: true,
                label: 'Disable',
                onClick: () => console.log('Disable user:', record.userId),
              },
              {
                key: 'details',
                label: 'Details',
                onClick: () => openDetailsModal(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#AF6900]">User List</h2>
          {/* <Button
            href="/dashboard/user/add-user"
            className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-2 rounded-[14px] text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <span>+</span>
            <span>Add User</span>
          </Button> */}
        </div>
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#AF6900]">User List</h2>
          {/* <Button
            href="/dashboard/user/add-user"
            className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-2 rounded-[14px] text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <span>+</span>
            <span>Add User</span>
          </Button> */}
        </div>
        <div className="text-center text-red-500 py-12">
          Failed to load user list. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#AF6900]">User List</h2>
        {/* <Button
          href="/dashboard/user/add-user"
          className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-2 rounded-[14px] text-sm font-medium flex items-center space-x-1 transition-colors"
        >
          <span>+</span>
          <span>Add User</span>
        </Button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={tableData}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: tableData.length,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            position: ['bottomCenter'],
            hideOnSinglePage: true,
          }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
          className="w-full"
          locale={{ emptyText: "No users found" }}
        />
      </div>

      {/* User Details Modal */}
      {/* <UserDetailsModal 
        visible={isModalOpen} 
        onCancel={closeDetailsModal} 
        user={selectedUser} 
      /> */}

      {/* --- Global Style: Match Booking Table Exactly --- */}
      <style jsx global>{`
        /* Table Header */
        .custom-recent-bookings-card .ant-table-thead > tr > th {
          background-color: #f5f5f5 !important;
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

export default UserList;