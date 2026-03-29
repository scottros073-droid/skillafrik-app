import { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";

export default function AIDashboard() {
  const [activeTool, setActiveTool] = useState("proposal"); // default tab
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    proposalsGenerated: 0,
    designsGenerated: 0,
    cvsGenerated: 0,
    earnings: 0,
  });

  // Proposal form
  const [proposalData, setProposalData] = useState({
    clientName: "",
    jobDescription: "",
    skills: "",
    budget: "",
    deliveryTime: "",
  });

  // Design form
  const [designData, setDesignData] = useState({
    type: "logo", // logo, banner, flyer, poster
    text: "",
    color: "",
  });

  // CV form
  const [cvData, setCVData] = useState({
    name: "",
    title: "",
    skills: "",
    experience: "",
    education: "",
  });

  useEffect(() => {
    // Fetch AI tool usage stats
    const fetchStats = async () => {
      try {
        const res = await axios.get("/ai/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch AI stats:", err);
      }
    };
    fetchStats();
  }, []);

  // ================= AI Proposal =================
  const generateProposal = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/ai/proposal", {
        ...proposalData,
        skills: proposalData.skills.split(",").map((s) => s.trim()),
      });
      alert("Proposal Generated!\n\n" + res.data.proposal);
      setStats((prev) => ({ ...prev, proposalsGenerated: prev.proposalsGenerated + 1, earnings: prev.earnings + 0.5 }));
    } catch (err) {
      alert(err.response?.data?.message || "Proposal generation failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= AI Design =================
  const generateDesign = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/ai/design", designData, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${designData.type}.png`);
      document.body.appendChild(link);
      link.click();
      setStats((prev) => ({ ...prev, designsGenerated: prev.designsGenerated + 1, earnings: prev.earnings + 1 }));
    } catch (err) {
      alert(err.response?.data?.message || "Design generation failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= AI CV =================
  const generateCV = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/ai/generate/cv", {
        ...cvData,
        skills: cvData.skills.split(",").map((s) => s.trim()),
      }, { responseType: "blob" });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${cvData.name}_CV.pdf`);
      document.body.appendChild(link);
      link.click();

      setStats((prev) => ({ ...prev, cvsGenerated: prev.cvsGenerated + 1, earnings: prev.earnings + 1 }));
    } catch (err) {
      alert(err.response?.data?.message || "CV generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">⭐ AI Tools Dashboard</h1>

      {/* ================= Tabs ================= */}
      <div className="flex space-x-4 mb-6">
        {["proposal", "design", "cv"].map((tool) => (
          <button
            key={tool}
            onClick={() => setActiveTool(tool)}
            className={`px-4 py-2 rounded-xl font-semibold ${
              activeTool === tool ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            {tool === "proposal" ? "AI Proposal Writer" : tool === "design" ? "AI Design Generator" : "AI CV Creator"}
          </button>
        ))}
      </div>

      {/* ================= Stats ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Proposals Generated" value={stats.proposalsGenerated} />
        <StatCard label="Designs Generated" value={stats.designsGenerated} />
        <StatCard label="CVs Generated" value={stats.cvsGenerated} />
        <StatCard label="Earnings ($)" value={stats.earnings.toFixed(2)} />
      </div>

      {/* ================= Active Tool ================= */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
        {activeTool === "proposal" && (
          <ProposalForm form={proposalData} setForm={setProposalData} generate={generateProposal} loading={loading} />
        )}
        {activeTool === "design" && (
          <DesignForm form={designData} setForm={setDesignData} generate={generateDesign} loading={loading} />
        )}
        {activeTool === "cv" && <CVForm form={cvData} setForm={setCVData} generate={generateCV} loading={loading} />}
      </div>
    </div>
  );
}

/* ================= Stat Card ================= */
function StatCard({ label, value }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow flex flex-col items-start">
      <p className="text-gray-500">{label}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}

/* ================= Proposal Form ================= */
function ProposalForm({ form, setForm, generate, loading }) {
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div className="space-y-3">
      <input name="clientName" placeholder="Client Name" className="input" value={form.clientName} onChange={handleChange} />
      <textarea name="jobDescription" placeholder="Job Description" className="input" value={form.jobDescription} onChange={handleChange} />
      <input name="skills" placeholder="Skills (comma separated)" className="input" value={form.skills} onChange={handleChange} />
      <input name="budget" placeholder="Budget ($)" className="input" value={form.budget} onChange={handleChange} />
      <input name="deliveryTime" placeholder="Delivery Time (days)" className="input" value={form.deliveryTime} onChange={handleChange} />
      <button onClick={generate} disabled={loading} className="btn">{loading ? "Generating..." : "Generate Proposal"}</button>
    </div>
  );
}

/* ================= Design Form ================= */
function DesignForm({ form, setForm, generate, loading }) {
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div className="space-y-3">
      <select name="type" className="input" value={form.type} onChange={handleChange}>
        <option value="logo">Logo</option>
        <option value="banner">Banner</option>
        <option value="flyer">Flyer</option>
        <option value="poster">Poster</option>
      </select>
      <input name="text" placeholder="Design Text" className="input" value={form.text} onChange={handleChange} />
      <input name="color" placeholder="Primary Color" className="input" value={form.color} onChange={handleChange} />
      <button onClick={generate} disabled={loading} className="btn">{loading ? "Generating..." : "Generate Design"}</button>
    </div>
  );
}

/* ================= CV Form ================= */
function CVForm({ form, setForm, generate, loading }) {
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div className="space-y-3">
      <input name="name" placeholder="Full Name" className="input" value={form.name} onChange={handleChange} />
      <input name="title" placeholder="Job Title" className="input" value={form.title} onChange={handleChange} />
      <input name="skills" placeholder="Skills (comma separated)" className="input" value={form.skills} onChange={handleChange} />
      <textarea name="experience" placeholder="Work Experience" className="input" value={form.experience} onChange={handleChange} />
      <textarea name="education" placeholder="Education" className="input" value={form.education} onChange={handleChange} />
      <button onClick={generate} disabled={loading} className="btn">{loading ? "Generating..." : "Generate CV"}</button>
    </div>
  );
}
