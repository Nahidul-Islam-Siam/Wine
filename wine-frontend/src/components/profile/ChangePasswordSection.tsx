/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ChangePasswordSection.jsx
'use client';
import { useState } from 'react';
import { Input } from 'antd';
import { useChangePasswordMutation } from '@/redux/service/auth/authApi';
import Swal from 'sweetalert2';

export default function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassword] = useChangePasswordMutation();

const handleUpdatePassword = async () => {
  // ✅ Frontend validation
  if (!currentPassword || !newPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please fill in all fields.',
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'New password and confirm password do not match.',
    });
    return;
  }

  if (newPassword.length < 6) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Password must be at least 6 characters long.',
    });
    return;
  }

  try {
    // ✅ Send ONLY what backend expects: oldPassword + newPassword
    const response = await changePassword({
      oldPassword: currentPassword,    // ✅ renamed to match backend
      newPassword: newPassword,        // ✅
      // ❌ DO NOT send confirmPassword
    }).unwrap();

    if (response.status) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.message,
      });

      // ✅ Clear form on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.message,
      });
    }
  } catch (error: any) {
    console.error("Change password error:", error);
    const message = error?.data?.message || error?.message || 'An error occurred while changing the password.';
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }
}; 
   

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Change Password</h2>
      <div className="space-y-5 max-w-md">
        <div className="space-y-2">
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <Input.Password
            id="current-password"
            placeholder="Old Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            size="large"
            // Remove bg-gray-50 from here — we’ll enforce via CSS
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <Input.Password
            id="new-password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            size="large"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <Input.Password
            id="confirm-password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            size="large"
          />
        </div>
        <button
          onClick={handleUpdatePassword}
          className="bg-[#AF6900] hover:bg-[#9E845C] text-white px-8 py-2.5 rounded-md font-medium transition-colors"
        >
          Update Now
        </button>
      </div>

      {/* 🔧 Fix hover/focus black background */}
      <style jsx global>{`
        .ant-input-password input.ant-input,
        .ant-input-password input.ant-input:hover,
        .ant-input-password input.ant-input:focus {
          background-color: #f9fafb !important; /* Tailwind's bg-gray-50 */
          border-color: #d1d5db !important;
          color: #1f2937 !important;
        }
        /* Optional: remove any dark on wrapper */
        .ant-input-password {
          background-color: #f9fafb !important;
        }
      `}</style>
    </div>
  );
}