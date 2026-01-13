/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef } from 'react';
import { Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDeleteBrandMutation, useUpdateBrandMutation } from '@/redux/service/admin/brandApi';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { UploadIcon } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  des: string | null;
  img: string | null;
}

export default function BrandTable({ brands }: { brands: Brand[] }) {
  const [deleteBrand] = useDeleteBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: '', des: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async (id: string) => {
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

    if (!result.isConfirmed) return;

    Swal.fire({
      title: 'Deleting...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await deleteBrand(id).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: res.message || 'Brand deleted successfully.',
        confirmButtonColor: '#AF6900',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        'An unexpected error occurred.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      des: brand.des || '',
    });
    setPreviewUrl(brand.img || '');
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'File must be smaller than 10MB',
        confirmButtonColor: '#d33',
      });
      return;
    }
    if (!file.type.match("image/(png|jpeg|jpg)")) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Only PNG/JPG files allowed',
        confirmButtonColor: '#d33',
      });
      return;
    }

    setLogoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdate = async () => {
    if (!selectedBrand) return;
    
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Brand name is required',
        confirmButtonColor: '#d33',
      });
      return;
    }

    Swal.fire({
      title: 'Updating...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const formDataToSend = new FormData();
      
      // Add data object as JSON string
      const dataPayload = {
        name: formData.name.trim(),
        des: formData.des.trim() || null,
      };
      formDataToSend.append('data', JSON.stringify(dataPayload));
      
      // Add image file if selected
      if (logoFile) {
        formDataToSend.append('img', logoFile);
      }

      await updateBrand({ id: selectedBrand.id, formData: formDataToSend }).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Brand updated successfully.',
        confirmButtonColor: '#AF6900',
        timer: 2000,
        showConfirmButton: false,
      });
      
      setIsModalOpen(false);
      setLogoFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Failed to update brand.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#d33',
      });
    }
  };

  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Brand) => (
        <div className="flex items-center space-x-2">
        <span className="w-10 h-10 rounded-full flex items-center justify-center text-white  font-bold">
          <Image 
            width={100}
            height={100}
            src={record.img || ''}
            alt={record.name}
            className="w-10 h-10 rounded object-contain border"
          />
        </span>
        <span className="font-roboto text-gray-700">{record.name}</span>
      </div>
      ),
    },
    {
      title: 'Action',
      key: 'actions',
      width: 120,
      render: (_: any, record: Brand) => (
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
      <div className="overflow-x-auto">
        <Table
          dataSource={brands}
          columns={columns}
          rowKey="id"
          pagination={false}
          className="font-roboto"
          style={{ background: 'transparent' }}
          bordered={false}
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
              row: (props: any) => (
                <tr {...props} className="hover:bg-gray-50" />
              ),
              cell: (props: any) => (
                <td
                  {...props}
                  className="py-3 px-4 text-gray-700 border-b border-gray-200"
                />
              ),
            },
          }}
        />
      </div>

      {/* Edit Brand Modal */}
      {isModalOpen && selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Edit Brand</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form className="space-y-5">
              {/* Brand Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Logo
                </label>
                <div className="flex items-center gap-4">
                  {previewUrl ? (
                    <Image 
                      width={100}
                      height={100}
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-16 h-16 rounded object-contain border"
                    />
                  ) : selectedBrand.img ? (
                    <Image 
                      width={100}
                      height={100}
                      src={selectedBrand.img || ''} 
                      alt="Current" 
                      className="w-16 h-16 rounded object-contain border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                      <UploadIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#AF6900]">
                      Upload New Logo
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {previewUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Brand Name */}
              <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  id="brandName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-[#AF6900]"
                  placeholder="Enter brand name"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="brandDes" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="brandDes"
                  value={formData.des}
                  onChange={(e) => setFormData({ ...formData, des: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-[#AF6900]"
                  placeholder="Enter brand description"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="flex-1 py-2.5 bg-[#AF6900] text-white font-medium rounded-md hover:bg-[#9E845C] transition-colors shadow-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}