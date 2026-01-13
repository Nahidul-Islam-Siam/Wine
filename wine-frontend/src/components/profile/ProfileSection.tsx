/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProfileSection.jsx
'use client';
import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { useGetUserProfileQuery, useUpdateProfileMutation } from '@/redux/service/auth/customer/profile';
import Image from 'next/image';
import Swal from 'sweetalert2';

export default function ProfileSection() {
  const { data, isLoading, isError } = useGetUserProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Extract user and profile
  const user = data?.data?.user;
  const profileData = user?.profile;

  // Form state — ONLY fields accepted by backend
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
  });

  // Sync form when API data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: profileData?.fullName || user.name || '',
        phone: user.phone || '',
        gender: profileData?.gender || '',
      });
    }
  }, [user, profileData]);

  // Handlers
  const handleEditClick = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    if (user) {
      setFormData({
        name: profileData?.fullName || user.name || '',
        phone: user.phone || '',
        gender: profileData?.gender || '',
      });
    }
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e: any) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setSelectedFile(file);

  //     // Revoke previous URL if exists
  //     if (previewUrl) URL.revokeObjectURL(previewUrl);

  //     const objectUrl = URL.createObjectURL(file);
  //     setPreviewUrl(objectUrl);
  //   }
  // };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const body = new FormData();

    // Create a "data" object for text fields
    const dataObj: any = {};
    if (formData.name) dataObj.name = formData.name;
    if (formData.phone) dataObj.phone = formData.phone;
    if (formData.gender) dataObj.gender = formData.gender;

    // Append the JSON string under "data"
    body.append('data', JSON.stringify(dataObj));

    // Append photo separately
    if (selectedFile) {
      body.append('photo', selectedFile); // backend expects "photo"
    }

    // Debug log
    console.log('FormData being sent:');
    for (const [key, value] of body.entries()) {
      if (value instanceof File) console.log(key, value.name);
      else console.log(key, value);
    }

    try {
      const res: any = await updateProfile(body).unwrap();
      console.log('Update profile response:', res);

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: res.message || 'Your profile has been updated successfully.',
        confirmButtonColor: '#AF6900',
        timer: 2000,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err: any) {
      console.error('Update profile error:', err);
      let message = 'Failed to update profile. Please try again.';
      if (err?.data?.message) message = err.data.message;
      else if (err?.message) message = err.message;

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: message,
        confirmButtonColor: '#d33',
      });
    }
  };

  // Loading & Error states
  if (isLoading)
    return <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl mx-auto">Loading...</div>;
  if (isError)
    return <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl mx-auto">Failed to load profile.</div>;
  if (!user)
    return <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl mx-auto">No profile data.</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col items-center">
        {/* Avatar with Edit Button */}
        <div className="relative mb-6">
          {user.photo ? (
            <Image
              width={400}
              height={400}
              src={ "/images/avatar3.png"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-[#F3F3F5] flex items-center justify-center border-2 border-white shadow-sm">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
          )}
          <button
            onClick={handleEditClick}
            className="absolute -bottom-2 -right-2 bg-[#AF6900] rounded-full p-2 shadow-md hover:shadow-lg transition-all"
            aria-label="Edit profile"
          >
            <Edit className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Name & ID */}
        <h1 className="text-2xl font-semibold text-gray-900">{profileData?.fullName || user.name}</h1>
        <p className="text-sm text-gray-500 mt-1">ID: {user.id}</p>

        {/* Profile Info */}
        <div className="mt-6 space-y-3 w-full max-w-sm">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-gray-700 w-20">Contact</span>
            <span className="text-gray-600">{user.phone || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-gray-700 w-20">Email</span>
            <span className="text-gray-600">{user.email}</span>
          </div>
          {profileData?.gender && (
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-gray-700 w-20">Gender</span>
              <span className="text-gray-600">{profileData.gender}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleCancel}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
              <button type="button" onClick={handleCancel} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar Upload */}
              {/* <div className="flex items-center gap-4">
                {previewUrl ? (
                  <img width={400} height={400} src={previewUrl || "/images/avatar3.png"} alt="Preview" className="w-12 h-12 rounded-full object-cover border" />
                ) : user.photo ? (
                  <img width={400} height={400} src={user.photo} alt="Current" className="w-12 h-12 rounded-full object-cover border" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-5.656-3.907A4 4 0 0 0 12 12a4 4 0 0 0-2.344 1.093A4 4 0 0 0 4 17v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                <label className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#AF6900]">
                  Upload Picture
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div> */}

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-[#AF6900]" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+880 1234 56789" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-[#AF6900]" />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select id="gender" name="gender" value={formData.gender || ''} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-[#AF6900]">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#AF6900] text-white font-medium rounded-md hover:bg-[#9E845C] transition-colors shadow-sm">Save Changes</button>
                <button type="button" onClick={handleCancel} className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
