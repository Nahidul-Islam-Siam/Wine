/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Table, Dropdown, Menu, Button, Tag, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import { useGetPaymentHistoryByAdminQuery } from "@/redux/service/admin/paymentApi";

// --------------------
// Interfaces
// --------------------
interface PaymentTableItem {
  key: string;
  customerId: string;
  name: string;
  totalProduct: number;
  productNames: string;
  paymentDate: string;
  paymentStatus: "Paid" | "Pending";
  totalPrice: number;
  transactionId: string | null;
}

// --------------------
// Action Menu
// --------------------
const ActionMenu: React.FC<{
  onViewDetails: () => void;
 
  onDelete: () => void;
}> = ({ onViewDetails }) => (
  <Menu>
    <Menu.Item key="view" onClick={onViewDetails}>
      View Details
    </Menu.Item>

    {/* <Menu.Item key="delete" danger onClick={onDelete}>
      Remove
    </Menu.Item> */}
  </Menu>
);

// --------------------
// Main Component
// --------------------
const PaymentTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const [selectedPayment, setSelectedPayment] = useState<PaymentTableItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data } = useGetPaymentHistoryByAdminQuery();

  // --------------------
  // Map API data to table format
  // --------------------
  const tableData: PaymentTableItem[] = useMemo(() => {
    if (!data?.data?.payments) return [];
    return data.data.payments.map((item) => {
      const orderProducts = item.order?.orderProducts || [];
      return {
        key: item.id,
        customerId: item.userId,
        name: item.name || item.order?.name || "N/A",
        totalProduct: orderProducts.reduce((acc, p) => acc + p.quantity, 0),
        productNames: orderProducts.map((p) => p.product.name).join(", "),
        paymentDate: new Date(item.order?.createdAt || new Date()).toLocaleDateString(),
        paymentStatus: item.status === "CONFIRMED" ? "Paid" : "Pending",
        totalPrice: item.paidAmount,
        transactionId: item.transactionId,
      };
    });
  }, [data]);

  const showDetails = (record: PaymentTableItem) => {
    setSelectedPayment(record);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedPayment(null);
  };

  const renderPaymentTag = (status: PaymentTableItem["paymentStatus"]) => (
    <Tag color={status === "Paid" ? "green" : "orange"}>{status}</Tag>
  );

  const columns = [
    { title: "Customer ID", dataIndex: "customerId", key: "customerId", width: 120 },
    { title: "Name", dataIndex: "name", key: "name", width: 180 },
    { title: "Total Product", dataIndex: "totalProduct", key: "totalProduct", width: 120 },
    { title: "Product Name(s)", dataIndex: "productNames", key: "productNames", width: 250 },
    { title: "Payment Date", dataIndex: "paymentDate", key: "paymentDate", width: 130 },
    { title: "Payment", dataIndex: "paymentStatus", key: "paymentStatus", width: 100, render: renderPaymentTag },
    { title: "Total Price", dataIndex: "totalPrice", key: "totalPrice", width: 100, render: (price: number) => <span>${price}</span> },
    { title: "Transaction ID", dataIndex: "transactionId", key: "transactionId", width: 180 },
    {
      title: "Actions",
      key: "action",
      width: 80,
      render: (_: any, record: PaymentTableItem) => (
        <Dropdown
          overlay={
            <ActionMenu
              onViewDetails={() => showDetails(record)}
              // onEdit={() => console.log("Edit", record.key)}
              onDelete={() => console.log("Delete", record.key)}
            />
          }
          trigger={["click"]}
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
        <h2 className="text-xl font-semibold text-[#AF6900]">Payment List</h2>
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
            position: ["bottomCenter"],
            hideOnSinglePage: false, // 👈 Always show pagination

          }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
          className="w-full"
        />

        <style jsx global>{`
  .custom-payment-table .ant-pagination {
    display: flex !important;
    justify-content: end !important; /* center pagination */
  }
`}</style>
      </div>

      {/* Modal */}
   <Modal
        title="Payment Details"
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        centered
        width={600}
          className="custom-payment-modal"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Customer Name:</span>
              <span>{selectedPayment.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Customer ID:</span>
              <span>{selectedPayment.customerId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Product(s):</span>
              <span>{selectedPayment.productNames}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Product:</span>
              <span>{selectedPayment.totalProduct}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Price:</span>
              <span>${selectedPayment.totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Status:</span>
              {renderPaymentTag(selectedPayment.paymentStatus)}
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Transaction ID:</span>
              <span>{selectedPayment.transactionId || "N/A"}</span>
            </div>
          </div>
        )}
      </Modal> 

    </div>
  );
};

export default PaymentTable;
