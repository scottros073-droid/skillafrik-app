import { useState, useEffect } from "react";
import { FaUpload, FaSave } from "react-icons/fa";
import axios from "../../utils/axios";

export default function ProfileEditor() {
  const [user, setUser] = useState({});
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [purpose, setPurpose] = useState("");
  const [skills, setSkills] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setTitle(savedUser.title || "");
      setBio(savedUser.bio || "");
      setPurpose(savedUser.purpose || "");
      setSkills((savedUser.skills || []).join(", "));
      setPreview(savedUser.avatar || "/avatar.png");
    }
  }, []);

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Save profile
  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("bio", bio);
      formData.append("purpose", purpose);
      formData.append("skills", skills);
      if (avatar) formData.append("avatar", avatar);

      const res = await axios.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col gap-6">

      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Edit Your Profile
      </h1>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <img
          src={preview}
          alt="avatar"
          className="w-28 h-28 rounded-full border object-cover"
        />
        <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-500">
          <FaUpload /> Upload Avatar
          <input type="file" className="hidden" onChange={handleAvatarChange} />
        </label>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 dark:text-gray-200">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Professional Title"
            className="mt-1 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 dark:text-gray-200">Purpose</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Your purpose"
            className="mt-1 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold text-gray-700 dark:text-gray-200">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio to attract clients"
            className="mt-1 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={4}
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold text-gray-700 dark:text-gray-200">Skills (comma separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., React, Node.js, Graphic Design"
            className="mt-1 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="self-start bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-500 disabled:opacity-50"
      >
        <FaSave /> {loading ? "Saving..." : "Save Profile"}
      </button>

    </div>
  );
}
