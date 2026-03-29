import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import axios from "../../utils/axiosInstance";

export default function DesignGenerator() {
  const { user } = useUser();
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase();

  // protect route from clients
  useEffect(() => {
    if (role && role !== "freelancer") {
      navigate("/dashboard", { replace: true });
    }
  }, [role, navigate]);

  const [type, setType] = useState("logo");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const generate = async () => {
    try {
      const res = await axios.post("/ai/generate/design", { type, description });
      setImageUrl(res.data.imageUrl);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate design");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Design Generator</h1>

      <select
        className="w-full border p-3 rounded mb-3"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="logo">Logo</option>
        <option value="banner">Banner</option>
        <option value="flyer">Flyer</option>
        <option value="poster">Poster</option>
        <option value="youtube thumbnail">YouTube Thumbnail</option>
      </select>

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Describe your design (e.g., 'Church flyer with modern style')"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={generate}
        className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-500"
      >
        Generate Design
      </button>

      {imageUrl && (
        <div className="mt-6">
          <img src={imageUrl} alt="AI Design" className="rounded shadow" />
        </div>
      )}
    </div>
  );
}
