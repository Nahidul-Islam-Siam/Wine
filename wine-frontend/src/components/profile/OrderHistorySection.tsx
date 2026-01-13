// components/OrderHistorySection.jsx
'use client';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface OrderData {
  key: string;
  productName: string;
  totalOrder: number;
  orderDate: string;
  totalPrice: string;
  transactionId: string;
}

const orderData: OrderData[] = [
  {
    key: "1",
    productName: "Red Wine",
    totalOrder: 2,
    orderDate: "12/12/2025",
    totalPrice: "$400",
    transactionId: "TXN-230914-001",
  },
  {
    key: "2",
    productName: "Red Wine",
    totalOrder: 2,
    orderDate: "12/12/2025",
    totalPrice: "$400",
    transactionId: "TXN-230914-001",
  },
  {
    key: "3",
    productName: "Red Wine",
    totalOrder: 2,
    orderDate: "12/12/2025",
    totalPrice: "$400",
    transactionId: "TXN-230914-001",
  },
  {
    key: "4",
    productName: "Red Wine",
    totalOrder: 2,
    orderDate: "12/12/2025",
    totalPrice: "$400",
    transactionId: "TXN-230914-001",
  },
  {
    key: "5",
    productName: "Red Wine",
    totalOrder: 2,
    orderDate: "12/12/2025",
    totalPrice: "$400",
    transactionId: "TXN-230914-001",
  },
];

const columns: ColumnsType<OrderData> = [
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
    align: "left",
  },
  {
    title: "Total Order",
    dataIndex: "totalOrder",
    key: "totalOrder",
    align: "center",
  },
  {
    title: "Order Date",
    dataIndex: "orderDate",
    key: "orderDate",
    align: "center",
  },
  {
    title: "Total Price",
    dataIndex: "totalPrice",
    key: "totalPrice",
    align: "center",
  },
  {
    title: "Transaction Id",
    dataIndex: "transactionId",
    key: "transactionId",
    align: "center",
    render: (text) => <span className="text-[#AF6900] font-medium">{text}</span>, // Optional: color Transaction ID
  },
];

export default function OrderHistorySection() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-abhaya font-extrabold text-center text-[#000000] mb-6">
        Order History
      </h2>
      <Table
        columns={columns}
        dataSource={orderData}
        pagination={false}
        className="custom-order-table"
        rowClassName={() => "border-b border-gray-200 hover:bg-gray-50"}
      />
<style jsx global>{`
  .custom-order-table {
    border-radius: 8px;
    overflow: hidden;
    background: white; /* Explicit white */
  }

  .custom-order-table .ant-table-thead > tr > th {
    background-color: #f3f4f6 !important;
    font-weight: 600;
    color: #1f2937;
    padding: 12px 16px;
    border: none !important;
    text-align: center !important;
  }

  .custom-order-table .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border: none !important;
    color: #4b5563;
    text-align: center !important;
    background: white !important; /* Force white cell bg */
  }

  .custom-order-table .ant-table-tbody > tr:hover > td {
    background-color: #f9fafb !important;
  }

  /* Kill all borders & shadows */
  .custom-order-table .ant-table-container,
  .custom-order-table .ant-table-content,
  .custom-order-table .ant-table-thead,
  .custom-order-table .ant-table-tbody {
    border: none !important;
    box-shadow: none !important;
  }

  /* Optional: Make row separators subtle */
  .custom-order-table .ant-table-tbody > tr:not(:last-child) > td {
    border-bottom: 1px solid #e5e7eb;
  }
`}</style>
    </div>
  );
}