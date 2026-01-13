/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import { Spin } from 'antd';

import BottleSizeTable from './BottleSize';
import { useCreateSizeMutation, useGetSizeListQuery } from '@/redux/service/admin/bottleSizeApi';

export default function BottleManagement() {
  const [bottleSizes, setBottleSizes] = useState<{ id: string; name: string }[]>([]);
  const [sizeName, setSizeName] = useState('');
  const [isAdding, setIsAdding] = useState(false); // ✅ Loading state

  const { data: sizeData } = useGetSizeListQuery();
  const [createSize] = useCreateSizeMutation();
  

  const handleAdd = async () => {
    if (!sizeName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Size name is required',
        confirmButtonColor: '#d33',
      });
      return;
    }

    setIsAdding(true); // ✅ Start loading

    try {
      const res = await createSize({ name: sizeName.trim() }).unwrap();
      if (res.status === true) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Bottle size added successfully.',
          confirmButtonColor: '#AF6900',
          timer: 1500,
          showConfirmButton: false,
        });
        
        // ✅ Only add to local state on success
        const newBottle = {
          id: res.data?.id || Date.now().toString(), // Use real ID if available
          name: sizeName.trim(),
        };
        setBottleSizes([...bottleSizes, newBottle]);
        setSizeName('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.message || 'Failed to add bottle size.',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error: any) {
      console.error('Failed to add size:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.data?.message || 'An error occurred while adding the bottle size.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsAdding(false); // ✅ Stop loading (success or error)
    }
  };

  const handleDelete = (id: string) => {
    setBottleSizes(bottleSizes.filter((b) => b.id !== id));
  };

  const handleUpdate = (id: string, name: string) => {
    setBottleSizes(
      bottleSizes.map((b) =>
        b.id === id ? { ...b, name } : b
      )
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 font-marcellus">
        Wind Bottle Size Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Form */}
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4 font-roboto">
            Add New Bottle Size
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bottle Size *
              </label>
              <input
                type="text"
                value={sizeName}
                onChange={(e) => setSizeName(e.target.value)}
                className="w-full p-2 border rounded-md font-roboto border-gray-300"
                placeholder="e.g. 500ml, 1L"
                disabled={isAdding} // ✅ Disable during loading
              />
            </div>

            <button
              className="w-full mt-2 bg-[#AF6900] text-white py-3 rounded-md font-roboto flex items-center justify-center"
              onClick={handleAdd}
              disabled={isAdding} // ✅ Disable button during loading
            >
              {isAdding ? (
                <>
                  <Spin size="small" className="mr-2" />
                  Adding...
                </>
              ) : (
                "Add Bottle Size"
              )}
            </button>
          </div>
        </div>

        {/* Bottle List */}
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4 font-roboto">
            Bottle Sizes
          </h2>

          <BottleSizeTable
            bottleSizes={(sizeData?.data.sizes || []).map((size: any) => ({
              id: size.id,
              name: size.name,
            }))}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
}