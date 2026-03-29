// frontend/src/pages/Profile/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import { FaUserCircle, FaCamera } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    role: "",
    avatar: "", // new field for avatar URL
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        setUser(res.data);
        if (res.data.avatar) setAvatarPreview(res.data.avatar);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setUser({ ...user, avatar: file }); // keep file to send to backend
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("email", user.email);
      formData.append("country", user.country);
      formData.append("role", user.role);
      if (user.avatar instanceof File) {
        formData.append("avatar", user.avatar);
      }

      await axiosInstance.put("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <p className="p-6 text-gray-500 dark:text-gray-400 text-center">
        Loading profile...
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow mt-10">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover shadow"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-200 text-7xl shadow">
              <FaUserCircle />
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition">
            <FaCamera className="text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{user.role || "Role not set"}</p>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={user.country}
            onChange={handleChange}
            placeholder="Country"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Role
          </label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Select Role</option>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={updating}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
