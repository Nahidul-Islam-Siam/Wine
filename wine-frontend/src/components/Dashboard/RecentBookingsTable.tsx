/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/RecentBookingsTable.tsx

'use client';

import { Card, Table, Dropdown, Button, Modal, Typography, Tag, Spin } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import { useGetRecentBookingsQuery } from '@/redux/service/admin/orderApi';

const { Text } = Typography;

/** Simplified interface matching /dashboard/recent-orders */
interface OrderRecord {
  key: string;
  orderId: string;
  customer: string;
  product: string;
  orderDate: string;
  qty: number;
  totalAmount: number;
  status: 'Complete' | 'Cancelled' | 'Pending';
}

/** Props interface */
interface RecentBookingsTableProps {
  // Pagination props are kept for future use, but recent orders usually don't paginate
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function RecentBookingsTable({
  // currentPage,
  // setCurrentPage,
}: RecentBookingsTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ✅ Use recent bookings endpoint (lightweight)
  const { data: recentOrders, isLoading, isError } = useGetRecentBookingsQuery();

  // ✅ Transform recent API data to table format
  const tableData: OrderRecord[] = useMemo(() => {
    if (!recentOrders?.data) return [];

    return recentOrders.data.map((order: any) => {
      const product = order.orderProducts?.[0]; // first product
      return {
        key: order.id,
        orderId: order.id, // note: your recent API doesn't return `orderNo`, so use `id`
        customer: order.user?.name || 'Anonymous',
        product: product?.product?.name || 'N/A',
        orderDate: new Date(order.createdAt).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).replace(/,/, ' -'), // "01/02/26 - 11:18 AM"
        qty: product?.quantity || 0,
        totalAmount: order.amount,
        status:
          order.status === 'COMPLETED'
            ? 'Complete'
            : order.status === 'CANCELLED'
              ? 'Cancelled'
              : 'Pending',
      };
    });
  }, [recentOrders]);

  const showDetails = (record: OrderRecord) => {
    setSelectedOrder(record);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  // Status badge renderer
  const renderStatusTag = (status: OrderRecord['status']) => {
    let color = 'default';
    if (status === 'Complete') color = 'green';
    if (status === 'Cancelled') color = 'red';
    if (status === 'Pending') color = 'purple';
    return <Tag color={color}>{status}</Tag>;
  };

  // Qty renderer
  const renderQty = (qty: number) => (
    <span
      style={{
        backgroundColor: '#A7997D',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
      }}
    >
      {qty}
    </span>
  );

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 180,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 160,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 60,
      render: renderQty,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => `$${amount}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderStatusTag,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_: any, record: OrderRecord) => (
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'View Details', onClick: () => showDetails(record) },
              // { key: '2', label: 'View Profile', onClick: () => alert('View Profile') },
              // { key: '2', label: 'Remove', danger: true, onClick: () => alert('Remove') },
            ],
          }}
          placement="bottomRight"
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // ✅ Loading & Error States
  if (isLoading) {
    return (
      <Card
        className="custom-recent-order-card"
        title={<TitleWithLink />}
        style={{ borderRadius: '0', border: 'none', backgroundColor: 'transparent', overflow: 'hidden' }}
        bodyStyle={{ padding: 0, backgroundColor: 'transparent' }}
      >
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card
        className="custom-recent-order-card"
        title={<TitleWithLink />}
        style={{ borderRadius: '0', border: 'none', backgroundColor: 'transparent', overflow: 'hidden' }}
        bodyStyle={{ padding: 0, backgroundColor: 'transparent' }}
      >
        <div className="text-center text-red-500 py-12">
          Failed to load recent orders.
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        className="custom-recent-order-card"
        title={<TitleWithLink />}
        style={{ borderRadius: '0', border: 'none', backgroundColor: 'transparent', overflow: 'hidden' }}
        bodyStyle={{ padding: 0, backgroundColor: 'transparent' }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false} // ✅ Recent orders usually don't need pagination
            scroll={{ x: 800 }}
            tableLayout="auto"
            bordered={false}
            style={{ marginTop: '20px' }}
            locale={{ emptyText: 'No recent orders' }}
          />
        </div>

        <style jsx global>{`
          .ant-table-tbody {
            background-color: #fff !important;
          }
          .custom-recent-order-card .ant-card-head {
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
          .custom-recent-order-card .ant-card-head-title {
            color: #a7997d !important;
            font-weight: 600 !important;
            font-size: 18px !important;
          }
          .custom-recent-order-card .ant-table-thead > tr > th {
            background-color: #f5f5f5 !important;
            color: #333 !important;
            font-weight: 600 !important;
            border: 1px solid #e5e7eb !important;
            padding: 12px 16px;
            font-size: 14px;
          }
          .custom-recent-order-card .ant-table-tbody > tr {
            border-bottom: 1px solid #e5e7eb !important;
          }
          .custom-recent-order-card .ant-table-tbody > tr:hover {
            background-color: #fafafa !important;
          }
        `}</style>
      </Card>

      {/* Modal: Order Details */}
      <Modal
        title="Order Details"
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        centered
        width={600}
      >
        {selectedOrder && (
          <div style={{ padding: '20px', lineHeight: '2.2' }}>
            <DetailRow label="Order ID" value={selectedOrder.orderId} />
            <DetailRow label="Customer" value={selectedOrder.customer} />
            <DetailRow label="Product" value={selectedOrder.product} />
            <DetailRow label="Order Date" value={selectedOrder.orderDate} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Qty</Text>
              {renderQty(selectedOrder.qty)}
            </div>
            <DetailRow label="Total Amount" value={`$${selectedOrder.totalAmount}`} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Status</Text>
              {renderStatusTag(selectedOrder.status)}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

// ─── Reusable Components ─────────────────────────────────────

const TitleWithLink = () => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
    <span style={{ fontSize: '18px', color: '#A7997D', fontWeight: '600' }}>Recent Order</span>
    <a
      href="/admin/orders"
      style={{ fontSize: '14px', color: '#A7997D', textDecoration: 'none', fontWeight: '500' }}
    >
      Show All Orders
    </a>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <Text strong>{label}</Text>
    <Text>{value}</Text>
  </div>
);