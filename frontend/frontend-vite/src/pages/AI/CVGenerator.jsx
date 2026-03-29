import { useState } from "react";
import axios from "../../utils/axiosInstance";

export default function CVGenerator() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    skills: "",
    experience: "",
    education: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generateCV = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/ai/generate/cv",
        {
          ...form,
          skills: form.skills.split(",").map(s => s.trim()),
        },
        { responseType: "blob" } // Important for file download
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${form.name}_CV.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-4">AI Resume / CV Creator</h1>

      <input name="name" placeholder="Full Name" className="input" value={form.name} onChange={handleChange} />
      <input name="title" placeholder="Job Title" className="input" value={form.title} onChange={handleChange} />
      <input name="skills" placeholder="Skills (comma separated)" className="input" value={form.skills} onChange={handleChange} />
      <textarea name="experience" placeholder="Work Experience" className="input" value={form.experience} onChange={handleChange} />
      <textarea name="education" placeholder="Education" className="input" value={form.education} onChange={handleChange} />

      <button onClick={generateCV} disabled={loading} className="btn">
        {loading ? "Generating..." : "Generate CV & Download PDF"}
      </button>
    </div>
  );
}
