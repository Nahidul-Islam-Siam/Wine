/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/RecentBookingsTable.tsx

'use client';

import { Card, Table, Dropdown, Button, Modal, Tag, Skeleton } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import { useGetAllOrderByAdminQuery } from '@/redux/service/admin/orderApi';

/** Interface for order data */
interface OrderRecord {
  key: string;
  orderId: string;
  orderNo: string;
  customer: string;
  product: string;
  orderDate: string;
  qty: number;
  totalAmount: number;
  status: 'Complete' | 'Cancelled' | 'Pending';
}

/** Props interface */
interface RecentBookingsTableProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function OrderList({
  currentPage,
  setCurrentPage,
}: RecentBookingsTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const { data: ordersResponse, isLoading } = useGetAllOrderByAdminQuery();

  // Transform API data to table format
  const orderData = useMemo(() => {
    if (!ordersResponse?.data?.orders) return [];
    
    return ordersResponse.data.orders.map((order: any) => {
      // Get first product for display (you can show multiple in modal)
      const firstProduct = order.orderProducts[0]?.product;
      const totalQty = order.orderProducts.reduce((sum: number, op: any) => sum + op.quantity, 0);
      
      // Map status to display format
      let displayStatus: OrderRecord['status'] = 'Pending';
      if (order.status === 'COMPLETED') displayStatus = 'Complete';
      if (order.status === 'CANCELLED') displayStatus = 'Cancelled';
      
      return {
        key: order.id,
        orderId: order.id,
        orderNo: order.orderNo,
        customer: order.name || order.user?.name || 'N/A',
        product: firstProduct ? firstProduct.name : 'N/A',
        orderDate: new Date(order.createdAt).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).replace(/\//g, '-') + ' - ' + 
        new Date(order.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        qty: totalQty,
        totalAmount: order.amount,
        status: displayStatus,
        rawOrder: order // Store full order for modal
      };
    });
  }, [ordersResponse]);

  const showDetails = (record: any) => {
    setSelectedOrder(record.rawOrder);
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
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 140,
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
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 180,
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
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: 'View Details',
                onClick: () => showDetails(record),
              },
              {
                key: '2',
                label: 'View Profile',
                onClick: () => alert('View Profile clicked'),
              },
              {
                key: '3',
                label: 'Remove',
                danger: true,
                onClick: () => alert('Remove clicked'),
              },
            ],
          }}
          placement="bottomRight"
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card
        className="custom-recent-order-card"
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                color: '#A7997D',
                fontWeight: '600',
              }}
            >
              Recent Order
            </span>
            <a
              href="#"
              style={{
                fontSize: '14px',
                color: '#A7997D',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              Show All Orders
            </a>
          </div>
        }
        style={{
          borderRadius: '0',
          border: 'none',
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
        bodyStyle={{
          padding: 0,
          backgroundColor: 'transparent',
        }}
      >
        <Skeleton active paragraph={{ rows: 5 }} />
      </Card>
    );
  }

  return (
    <>
      <Card
        className="custom-recent-order-card"
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                color: '#A7997D',
                fontWeight: '600',
              }}
            >
              Recent Order
            </span>
            <a
              href="#"
              style={{
                fontSize: '14px',
                color: '#A7997D',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              Show All Orders
            </a>
          </div>
        }
        style={{
          borderRadius: '0',
          border: 'none',
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
        bodyStyle={{
          padding: 0,
          backgroundColor: 'transparent',
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table
            columns={columns}
            dataSource={orderData}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: ordersResponse?.data?.total || 0,
              onChange: setCurrentPage,
              showSizeChanger: false,
              position: ['bottomRight'],
              // hideOnSinglePage: true,
            }}
            scroll={{ x: 800 }}
            tableLayout="auto"
            bordered={false}
            style={{ marginTop: '20px' }}
            locale={{ emptyText: 'No orders found' }}
          />
        </div>

        {/* --- Global Styles --- */}
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

          /* Table Header */
          .custom-recent-order-card .ant-table-thead > tr > th {
            background-color: #f5f5f5 !important;
            color: #333 !important;
            font-weight: 600 !important;
            border: 1px solid #e5e7eb !important;
            padding: 12px 16px;
            font-size: 14px;
          }

          .custom-recent-order-card .ant-table-thead > tr:first-child > th:first-child {
            border-top-left-radius: 8px !important;
          }

          .custom-recent-order-card .ant-table-thead > tr:first-child > th:last-child {
            border-top-right-radius: 8px !important;
          }

          /* Table Body Rows */
          .custom-recent-order-card .ant-table-tbody > tr {
            border-bottom: 1px solid #e5e7eb !important;
          }

          .custom-recent-order-card .ant-table-tbody > tr:hover {
            background-color: #fafafa !important;
          }

          /* Pagination Styling */
          .custom-recent-order-card .ant-pagination-item-link,
          .custom-recent-order-card .ant-pagination-item a {
            color: black !important;
            border-color: #a7997d !important;
          }

          .custom-recent-order-card .ant-pagination-item-active {
            background-color: #a7997d !important;
            border-color: #a7997d !important;
          }

          .custom-recent-order-card .ant-pagination-item-active a {
            color: white !important;
          }

          .custom-recent-order-card .ant-pagination-item:hover a,
          .custom-recent-order-card .ant-pagination-item-link:hover {
            color: #5e5e5e !important;
            border-color: #5e5e5e !important;
          }

          .custom-recent-order-card .ant-pagination-prev a,
          .custom-recent-order-card .ant-pagination-next a {
            color: black !important;
          }

          .custom-recent-order-card .ant-pagination-prev button:disabled,
          .custom-recent-order-card .ant-pagination-next button:disabled {
            border-color: #ddd !important;
            color: #ccc !important;
          }
        `}</style>
      </Card>

      {/* 💡 Modal: Order Details */}
      <Modal
        title={
          <div className="flex justify-between items-center w-full bg-white">
            <h3 className="text-lg font-semibold text-gray-800">Order Details</h3>
          </div>
        }
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        centered
        width={800}
        styles={{
          body: {
            padding: '24px',
            backgroundColor: '#fff',
            borderRadius: '8px',
          },
        }}
      >
        {selectedOrder && (
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column: Customer Info */}
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Customer Name :</span>
                  <span className="text-gray-900">{selectedOrder.name || selectedOrder.user?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Phone Number :</span>
                  <span className="text-gray-900">{selectedOrder.phone || selectedOrder.user?.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email :</span>
                  <span className="text-gray-900">{selectedOrder.email || selectedOrder.user?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Address :</span>
                  <span className="text-gray-900">{selectedOrder.address || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Info */}
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Order No :</span>
                  <span className="text-gray-900">{selectedOrder.orderNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Order Date :</span>
                  <span className="text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Status :</span>
                  <span className="text-gray-900">{selectedOrder.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Total Amount :</span>
                  <span className="text-gray-900">${selectedOrder.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Payment Status :</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedOrder.paymentStatus === 'CONFIRMED' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-white'
                    }`}
                  >
                    {selectedOrder.paymentStatus === 'CONFIRMED' ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Products :</span>
                  <div className="text-right">
                    {selectedOrder.orderProducts.map((op: any, idx: number) => (
                      <div key={idx} className="text-gray-900">
                        {op.product.name} (Qty: {op.quantity})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}