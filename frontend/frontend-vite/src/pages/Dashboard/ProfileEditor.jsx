import { useEffect, useState } from "react";
import axios from "../../utils/axios";

export default function ProfileEditor() {
  const [profile, setProfile] = useState({});
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    axios.get("/profile").then(res => setProfile(res.data));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const form = new FormData();
    form.append("title", profile.title);
    form.append("bio", profile.bio);
    form.append("purpose", profile.purpose);
    form.append("skills", profile.skills?.join(",") || "");

    if (avatar) form.append("avatar", avatar);

    await axios.put("/profile", form);
    alert("Profile updated");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow space-y-6">

      <h1 className="text-3xl font-bold">Edit Your Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <img
          src={profile.avatar || "/avatar.png"}
          className="w-24 h-24 rounded-full object-cover"
        />
        <input type="file" onChange={e => setAvatar(e.target.files[0])} />
      </div>

      {/* Title */}
      <input
        name="title"
        value={profile.title || ""}
        onChange={handleChange}
        placeholder="Professional Title e.g Full Stack Developer"
        className="w-full p-3 border rounded"
      />

      {/* Bio */}
      <textarea
        name="bio"
        value={profile.bio || ""}
        onChange={handleChange}
        placeholder="Write a strong bio about your experience"
        className="w-full p-3 border rounded h-32"
      />

      {/* Skills */}
      <input
        name="skills"
        value={profile.skills?.join(",") || ""}
        onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(",") })}
        placeholder="Skills e.g React, Node, UI Design"
        className="w-full p-3 border rounded"
      />

      {/* Purpose */}
      <input
        name="purpose"
        value={profile.purpose || ""}
        onChange={handleChange}
        placeholder="Your freelance purpose"
        className="w-full p-3 border rounded"
      />

      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500"
      >
        Save Profile
      </button>
    </div>
  );
}
