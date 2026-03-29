import { useState } from "react";
import axios from "../../utils/axiosInstance";

export default function CreateAdPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    category: "product",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/ads", form);
      alert("Ad submitted successfully. Awaiting approval.");
      setForm({ title: "", description: "", link: "", category: "product" }); // reset form
    } catch (err) {
      console.error("Failed to submit ad:", err);
      alert("Error submitting ad. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Ad</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <input
          type="url"
          placeholder="Link (optional)"
          className="w-full border p-2 rounded"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />

        <select
          value={form.category}
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="product">Product</option>
          <option value="service">Service</option>
          <option value="job">Job</option>
          <option value="event">Event</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Submit Ad
        </button>
      </form>
    </div>
  );
}
