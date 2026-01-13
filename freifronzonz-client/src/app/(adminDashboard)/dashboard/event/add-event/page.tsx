/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Dashboard/All-Product/AddEventForm.tsx

'use client';

import { Form, Input, Upload, message, UploadFile, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { useCreateEventMutation } from '@/redux/service/admin/eventApi';
import Swal from 'sweetalert2';

const { TextArea } = Input;

export default function AddEventForm() {
  const [form] = Form.useForm();

  const [createEvent, { isLoading }] = useCreateEventMutation();
  const [eventImages, setEventImages] = useState<UploadFile[]>([]);


  const handleImageChange = (info: { fileList: UploadFile[] }) => {
    const file = info.fileList[0];
    if (file) {
      if (file.size && file.size > 10 * 1024 * 1024) {
        message.error('Image must be smaller than 10MB');
        return;
      }
      setEventImages([file]);
    } else {
      setEventImages([]);
    }
  };

const onFinish = async (values: any) => {
  if (eventImages.length === 0) {
    message.error('Please upload an event image');
    return;
  }

  const formData = new FormData();
  const eventData = {
    name: values.eventName,
    des: values.description,
    startDate: values.startDate,
    endDate: values.endDate,
    audienceSize: values.audienceSize,
    price: values.price,
    status: 'UP_COMMING',
  };

  formData.append('data', JSON.stringify(eventData));
  eventImages.forEach(file => {
    formData.append('images', file.originFileObj as File);
  });

 // Before sending the request
console.log("Submitting form with data:");
for (const [key, value] of formData.entries()) {
  console.log(key, value);
}

  
  // return 

  try {
    const result = await createEvent(formData).unwrap();

    if (result.status === true) {
      Swal.fire({
        icon: 'success',
        title: 'Event Created',
        text: result.message,
        confirmButtonColor: '#AF6900',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        // ✅ Reset only on success
        form.resetFields();
        setEventImages([]);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message,
        confirmButtonColor: '#d33',
      });
      // ❌ Do NOT reset on error
    }
  } catch (error: any) {
    console.error('Submission error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: error?.data?.message || 'Failed to create event. Please try again.',
      confirmButtonColor: '#d33',
    });
    // ❌ Do NOT reset on error
  }
};

  return (
    <div className="bg-[#F4F7FD] rounded-2xl shadow-md p-8 mx-auto">
      <h1 className="text-2xl font-bold text-[#A7997D] mb-8 text-center">
        Add New Event
      </h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6"
      >
        {/* Row 1: Event Name */}
        <Form.Item
          label={<span className="text-[#A7997D] font-medium">Event Name/Title *</span>}
          name="eventName"
          rules={[{ required: true, message: 'Please enter event name' }]}
        >
          <Input 
            placeholder="Wine Garden Tour" 
            className="rounded-lg border border-[#D9D9D9] h-12" 
          />
        </Form.Item>

        {/* Row 2: Start Date + End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label={<span className="text-[#A7997D] font-medium">Start Date *</span>}
            name="startDate"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <Input 
              type="date"
              className="rounded-lg border border-[#D9D9D9] h-12" 
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[#A7997D] font-medium">End Date *</span>}
            name="endDate"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <Input 
              type="date"
              className="rounded-lg border border-[#D9D9D9] h-12" 
            />
          </Form.Item>
        </div>

        {/* Row 3: Audience Size + Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label={<span className="text-[#A7997D] font-medium">Audience Size *</span>}
            name="audienceSize"
            rules={[{ required: true, message: 'Please enter audience size' }]}
          >
            <Input 
              placeholder="500" 
              className="rounded-lg border border-[#D9D9D9] h-12" 
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[#A7997D] font-medium">Price $ *</span>}
            name="price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <Input 
              placeholder="199" 
              type="number"
              className="rounded-lg border border-[#D9D9D9] h-12" 
            />
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item
          label={<span className="text-[#A7997D] font-medium">Description *</span>}
          name="description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea
            rows={4}
            placeholder="Describe your event..."
            className="rounded-lg border border-[#D9D9D9] p-3"
          />
        </Form.Item>
<Form.Item
  label={<span className="text-[#A7997D] font-medium">Event Images *</span>}
  name="eventImages"
  rules={[{ required: true, message: 'Please upload at least one image' }]}
>
  <Upload
    accept=".png,.jpg,.jpeg"
    beforeUpload={() => false} // prevent auto upload
    onChange={handleImageChange}
    fileList={eventImages}
    listType="picture-card"
    multiple // ✅ allow multiple images
  >
    <div className="flex flex-col items-center justify-center">
      <UploadOutlined className="text-3xl text-[#A7997D]" />
      <p className="mt-2 text-sm text-gray-600 font-medium">Click to upload images</p>
      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
    </div>
  </Upload>
</Form.Item>


        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="bg-[#AF6900] hover:bg-[#92826f] text-white px-12 py-4 rounded-xl text-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Publishing...' : 'Published'}
          </Button>
        </div>
      </Form>
    </div>
  );
}