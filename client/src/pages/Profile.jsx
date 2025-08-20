import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../services/axiosInstance';
import { fetchCurrentUser } from '../features/auth/authSlice';
import { FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';


const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(user?.profilePhoto ? (user.profilePhoto.startsWith('http') ? user.profilePhoto : BACKEND_URL + user.profilePhoto) : "" );
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPreview(user?.profilePhoto ? (user.profilePhoto.startsWith('http') ? user.profilePhoto : BACKEND_URL + user.profilePhoto) : "");
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);

    try {
      await axiosInstance.put('/api/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(fetchCurrentUser());
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    }

  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put('/api/auth/user_change_password', {
        currentPassword,
        newPassword,
      });
      toast.success(res.data.message || 'Password updated!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }

  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-50 rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">My Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center gap-2">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover ring-2 ring-slate-300 shadow-sm"
              onError={() => setPreview('')} // fallback if image fails to load
            />
          ) : (
            <FaUserCircle className="text-slate-400 w-28 h-28" />
          )}
          <label className="cursor-pointer text-blue-600 hover:underline">
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            Change Profile Photo
          </label>
        </div>

        <input
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-150"
          type="submit"
        >
          Update Profile
        </button>

      </form>

      <form onSubmit={handleChangePassword} className="space-y-5 mt-10 border-t border-slate-300 pt-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Change Password</h3>
        <input
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          required
        />
        <input
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 rounded-lg transition duration-150"
          type="submit"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Profile;
