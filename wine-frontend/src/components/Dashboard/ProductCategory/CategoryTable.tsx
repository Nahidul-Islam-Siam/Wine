/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDeleteCategoryMutation, useUpdateCategoryMutation } from '@/redux/service/admin/categoryApi';
import Swal from 'sweetalert2';

interface Category {
  id: string;
  name: string;
  des: string;
  img: string | null;
}

export default function CategoryTable({ categories }: { categories: Category[] }) {
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  // ✅ Handle Delete
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Deleting...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await deleteCategory(id).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: res.message || 'Category deleted successfully.',
        confirmButtonColor: '#AF6900',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Failed to delete category.';
      Swal.fire({ icon: 'error', title: 'Error', text: message, confirmButtonColor: '#d33' });
    }
  };

  // ✅ Handle Edit
const handleEdit = (category: Category) => {
  Swal.fire({
    title: 'Edit Category',
    html: `
      <input 
        id="swal-name" 
        class="swal2-input" 
        placeholder="Category Name"
        value="${category.name}"
      >
      <textarea 
        id="swal-des" 
        class="swal2-textarea" 
        placeholder="Description"
        style="width: 100%; padding: 0.75rem; border: 1px solid #d9d9d9; border-radius: 0.5rem; margin-top: 1rem;"
      >${category.des}</textarea>
    `,
    focusConfirm: false,
    confirmButtonText: 'Save Changes',
    confirmButtonColor: '#AF6900',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    preConfirm: () => {
      const nameInput = document.getElementById('swal-name') as HTMLInputElement;
      const desInput = document.getElementById('swal-des') as HTMLTextAreaElement;

      const name = nameInput?.value.trim();
      const des = desInput?.value.trim();

      if (!name) {
        Swal.showValidationMessage('Category name is required');
        return false;
      }
      if (!des) {
        Swal.showValidationMessage('Description is required');
        return false;
      }

      // ✅ Create JSON object
      const payload = {
        name,
        des,
      };

      // ✅ Convert to JSON string and append under "data" key
      const jsonData = JSON.stringify(payload);

      const formData = new FormData();
      formData.append('data', jsonData); // ← This is what your backend expects

      return { id: category.id, formData };
    },
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      const { id, formData } = result.value;

      Swal.fire({
        title: 'Saving...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const res = await updateCategory({ id, formData }).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: res.message || 'Category updated successfully.',
          confirmButtonColor: '#AF6900',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error: any) {
        const message = error?.data?.message || error?.message || 'Failed to update category.';
        Swal.fire({ 
          icon: 'error', 
          title: 'Error', 
          text: message, 
          confirmButtonColor: '#d33' 
        });
      }
    }
  });
};

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span className="font-roboto text-gray-700">{text}</span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'des',
      key: 'des',
      render: (text: string) => (
        <span className="font-roboto text-gray-600 text-sm">{text}</span>
      ),
    },
    {
      title: 'Action',
      key: 'actions',
      width: 120,
      render: (_: any, record: Category) => (
        <div className="flex space-x-3">
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => handleEdit(record)}
          >
            <EditOutlined />
          </button>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() =>
              Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#AF6900',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
              }).then((result) => {
                if (result.isConfirmed) handleDelete(record.id);
              })
            }
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-transparent">
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        pagination={false}
        className="font-roboto"
        style={{ background: 'transparent' }}
        bordered={false}
        scroll={{ x: 'max-content' }}
        components={{
          header: {
            wrapper: (props: any) => <thead {...props} className="bg-gray-100" />,
            cell: (props: any) => (
              <th
                {...props}
                className={`${props.className} py-3 px-4 font-medium text-gray-700 border-b border-gray-300`}
              />
            ),
          },
          body: {
            wrapper: (props: any) => <tbody {...props} className="bg-white" />,
            row: (props: any) => (
              <tr {...props} className={`${props.className} hover:bg-gray-50`} />
            ),
            cell: (props: any) => (
              <td
                {...props}
                className={`${props.className} py-3 px-4 text-gray-700 border-b border-gray-200`}
              />
            ),
          },
        }}
      />
    </div>
  );
}