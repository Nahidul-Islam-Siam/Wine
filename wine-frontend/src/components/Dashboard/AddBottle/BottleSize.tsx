/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useDeleteSizeMutation } from '@/redux/service/admin/bottleSizeApi';

interface BottleSize {
  id: string;
  name: string;
}

export default function BottleSizeTable({
  bottleSizes,
  onDelete,
  onUpdate,
}: {
  bottleSizes: BottleSize[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, name: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBottleSize, setSelectedBottleSize] = useState<BottleSize | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const [deleteSize] = useDeleteSizeMutation();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSize(id).unwrap();
      if (res.success) {
        onDelete(id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Bottle size deleted successfully.',
          confirmButtonColor: '#AF6900',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Failed to delete size:', error);
    }
  };

  const handleEdit = (size: BottleSize) => {
    setSelectedBottleSize(size);
    setFormData({ name: size.name });
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedBottleSize || !formData.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Size name is required',
        confirmButtonColor: '#d33',
      });
      return;
    }

    onUpdate(selectedBottleSize.id, formData.name.trim());
    setIsModalOpen(false);

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: 'Bottle size updated.',
      confirmButtonColor: '#AF6900',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const columns = [
    {
      title: 'Bottle Size',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'actions',
      width: 120,
      render: (_: any, record: BottleSize) => (
        <div className="flex space-x-2">
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => handleEdit(record)}
          >
            <EditOutlined />
          </button>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => handleDelete(record.id)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={bottleSizes}
        columns={columns}
        rowKey="id"
        className="font-roboto"
        bordered={false}
        pagination={{
          pageSize: 5,          // rows per page
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total) => `Total ${total} sizes`,
        }}
        components={{
          header: {
            cell: (props: any) => (
              <th
                {...props}
                className="py-3 px-4 font-medium text-gray-700 border-b border-gray-300"
              />
            ),
          },
          body: {
            row: (props: any) => <tr {...props} className="hover:bg-gray-50" />,
            cell: (props: any) => (
              <td
                {...props}
                className="py-3 px-4 text-gray-700 border-b border-gray-200"
              />
            ),
          },
        }}
      />

      {/* Edit Modal */}
      {isModalOpen && selectedBottleSize && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Bottle Size</h2>

            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpdate}
                className="flex-1 py-2 bg-[#AF6900] text-white rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 border rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
