/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Dashboard/All-Product/AddEventForm.tsx

'use client';

import { Form, Input, Button, Upload, message, UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Image from 'next/image';

const { TextArea } = Input;

export default function AddEventForm() {
  const [form] = Form.useForm();
  const [eventImage, setEventImage] = useState<UploadFile | null>(null);

  const handleImageChange = (info: { fileList: UploadFile[] }) => {
    const file = info.fileList[0];
    if (file) {
      if (file.size && file.size > 10 * 1024 * 1024) {
        message.error('Image must be smaller than 10MB');
        return;
      }
      setEventImage(file);
    }
  };

  const onFinish = (values: any) => {
    console.log('Submitted Values:', {
      ...values,
      eventImage: eventImage?.originFileObj,
    });
    message.success('Event created successfully!');
    form.resetFields();
    setEventImage(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl mx-auto">
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
            label={<span className="text-[#A7997D] font-medium">Start Date*</span>}
            name="startDate"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <Input 
              type="date"
              className="rounded-lg border border-[#D9D9D9] h-12" 
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[#A7997D] font-medium">End Date*</span>}
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
            label={<span className="text-[#A7997D] font-medium">Audience Size*</span>}
            name="audienceSize"
            rules={[{ required: true, message: 'Please enter audience size' }]}
          >
            <Input 
              placeholder="500" 
              className="rounded-lg border border-[#D9D9D9] h-12" 
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[#A7997D] font-medium">Price $*</span>}
            name="price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <Input 
              placeholder="$199" 
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
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            className="rounded-lg border border-[#D9D9D9] p-3"
          />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item
          label={<span className="text-[#A7997D] font-medium">Image *</span>}
          name="eventImage"
          rules={[{ required: true, message: 'Please upload event image' }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            accept=".png,.jpg,.jpeg"
            beforeUpload={() => false}
            onChange={handleImageChange}
            fileList={eventImage ? [eventImage] : []}
            showUploadList={false}
            className="border-2 border-dashed border-[#A7997D]/30 rounded-xl p-6 flex flex-col items-center justify-center hover:border-[#A7997D] transition-colors cursor-pointer"
          >
            <div className="flex flex-col items-center">
              {eventImage ? (
                <Image
                  width={100}
                  height={100}
                  src={URL.createObjectURL(eventImage.originFileObj as File)} 
                  alt="Preview" 
                  className="w-24 h-24 object-contain mb-3 rounded-lg"
                />
              ) : (
                <UploadOutlined className="text-3xl text-[#A7997D]" />
              )}
              <p className="mt-2 text-sm text-gray-600 font-medium">
                {eventImage ? 'Change Image' : 'Click to upload images'}
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[#A7997D] hover:bg-[#92826f] text-white px-12 py-4 rounded-xl text-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            Published
          </Button>
        </div>
      </Form>
    </div>
  );
}