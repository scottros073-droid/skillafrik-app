import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaPlus } from "react-icons/fa";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setName(`${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim());
      setBio(storedUser.bio || "");
      setSkills(storedUser.skills || []);
      setAvatarPreview(storedUser.avatar || "/avatar.png");
    }
  }, []);

  // Handle adding skills
  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  // Handle removing skills
  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("skills", JSON.stringify(skills));
      if (avatar) formData.append("avatar", avatar);

      const res = await axiosInstance.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      alert("✅ Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="p-6 text-center">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Edit Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6"
      >
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <img
            src={avatarPreview}
            alt="avatar"
            className="w-28 h-28 rounded-full border object-cover"
          />
          <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-500">
            <FaPlus /> Upload Avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {/* Name */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell clients about yourself..."
            className="border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
          />
        </div>

        {/* Skills */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Skills
          </label>

          {/* Add skill input */}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill"
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-500"
            >
              Add
            </button>
          </div>

          {/* Skills list */}
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-red-500 dark:text-red-400 font-bold ml-1"
                >
                  <FaTimes />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-md flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
