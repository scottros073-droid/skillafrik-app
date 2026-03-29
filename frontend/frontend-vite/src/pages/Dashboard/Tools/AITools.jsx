import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { FaPenNib, FaImage, FaFileAlt, FaComments } from "react-icons/fa";
import { useUser } from "../../../context/UserContext";
import axiosInstance from "../../../utils/axiosInstance";
import AIChatPage from "../../Chat/AIChatPage";

export default function AITools({ user: propUser }) {
  const { user: contextUser } = useUser();
  const user = propUser || contextUser;
  const role = user?.role?.toLowerCase();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  // determine which tabs this user may see
  const allTabs = [
    { id: "proposal", icon: <FaPenNib />, label: "AI Proposal Generator" },
    // logo/design is freelancer-only
    { id: "design", icon: <FaImage />, label: "AI Logo Designer", roles: ["freelancer"] },
    { id: "cv", icon: <FaFileAlt />, label: "AI CV Builder" },
    { id: "chat", icon: <FaComments />, label: "AI Chat Assistant" },
  ];

  const tabs = allTabs.filter((t) => !t.roles || t.roles.includes(role));
  const allowedIds = tabs.map((t) => t.id);

  // start on a permitted tab or fall back to first available
  const [active, setActive] = useState(() => {
    if (tabParam && allowedIds.includes(tabParam)) return tabParam;
    return tabs[0]?.id || "proposal";
  });

  // react to changes in the query string, enforce role restrictions
  const navigate = useNavigate();
  useEffect(() => {
    if (tabParam) {
      if (allowedIds.includes(tabParam)) {
        setActive(tabParam);
      } else {
        // wipe invalid/forbidden query and reset
        setActive(tabs[0]?.id || "proposal");
        navigate("/dashboard/ai", { replace: true });
      }
    }
  }, [tabParam, allowedIds, navigate, tabs]);

  // additional safety: if somehow active becomes design without rights, reset
  useEffect(() => {
    if (active === "design" && role !== "freelancer") {
      setActive(tabs[0]?.id || "proposal");
    }
  }, [active, role, tabs]);

  // rest of component follows

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">AI Tools</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Leverage AI to create proposals, logos, and professional CVs.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition
              ${active === t.id
                ? "bg-[#2563EB] text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]"}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {active === "proposal" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FaPenNib className="text-[#2563EB]" /> AI Proposal Generator
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">1 free usage • Generate professional proposals</p>
          <Link
            to="/dashboard/ai/proposal"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition"
          >
            Open Proposal Generator →
          </Link>
        </div>
      )}

      {active === "design" && role === "freelancer" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FaImage className="text-[#2563EB]" /> AI Logo Designer
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate logos, flyers, banners. Requires design credits.
          </p>
          <AILogoDesigner user={user} />
          <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
            Design credits: Purchase from Wallet or Upgrade to Premium.
          </p>
        </div>
      )}

      {active === "cv" && <AICVBuilderEmbed user={user} />}

      {active === "chat" && <AIChatPage />}
    </div>
  );
}

function AILogoDesigner({ user }) {
  const [type, setType] = useState("logo");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Describe what you want to create.");
      return;
    }
    setLoading(true);
    setError("");
    setImageUrl("");
    try {
      const res = await axiosInstance.post("/ai/generate/design", { type, description: description.trim() });
      setImageUrl(res.data.imageUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate. Check design credits.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
        >
          <option value="logo">Logo</option>
          <option value="banner">Banner</option>
          <option value="flyer">Flyer</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="e.g. A modern tech company logo with blue and green colors"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Design"}
      </button>
      {imageUrl && <img src={imageUrl} alt="Generated" className="mt-4 max-w-sm rounded-lg border" />}
    </div>
  );
}

/* ====================== AI CV Builder Embed ====================== */
function AICVBuilderEmbed({ user }) {
  const [name, setName] = useState(user?.firstName ? `${user.firstName} ${user.lastName}` : "");
  const [title, setTitle] = useState(user?.title || "");
  const [skills, setSkills] = useState(Array.isArray(user?.skills) ? user.skills.join(", ") : "");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!name.trim() || !skills.trim()) {
      setError("Name and skills are required.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axiosInstance.post("/ai/cv/generate/preview", {
        name: name.trim(),
        title: title.trim() || "Professional",
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        experience: experience.trim(),
        education: education.trim(),
      });
      setResult({
        coverLetter: res.data?.coverLetter,
        cvText: res.data?.cvText,
        name: name.trim(),
        title: title.trim() || "Professional",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate CV.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result?.cvText) return;
    setSaving(true);
    try {
      await axiosInstance.post("/ai/cv/save", {
        name: result.name,
        title: result.title,
        cvText: result.cvText,
        coverLetter: result.coverLetter || "",
      });
      setSaving(false);
      alert("CV saved to your profile.");
    } catch (err) {
      setSaving(false);
      setError(err.response?.data?.message || "Failed to save.");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await axiosInstance.post(
        "/ai/cv/generate/cv",
        {
          name: result.name,
          title: result.title,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          experience,
          education,
        },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.name.replace(/\s+/g, "_")}_CV.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || "PDF download failed. Upgrade to Premium.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaFileAlt className="text-[#2563EB]" /> AI CV Builder
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Free basic generation. PDF download for paid users.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professional Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Full Stack Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="React, Node.js, MongoDB"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe your work experience..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Education</label>
            <textarea
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Degrees, certifications..."
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] disabled:opacity-50 transition"
          >
            {loading ? "Generating..." : "Generate CV"}
          </button>
        </div>

        <div className="space-y-4">
          {result && (
            <>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">CV Preview</h3>
                <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm whitespace-pre-wrap overflow-auto max-h-64">
                  {result.cvText || result.coverLetter || "Generated content will appear here."}
                </pre>
              </div>
              {result.coverLetter && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cover Letter</h3>
                  <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm whitespace-pre-wrap overflow-auto max-h-48">
                    {result.coverLetter}
                  </pre>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save to Profile"}
                </button>
                {user?.isPremium ? (
                  <button
                    onClick={handleDownloadPDF}
                    className="py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                  >
                    Download PDF
                  </button>
                ) : (
                  <p className="py-2 text-sm text-amber-600">Upgrade to Premium to download PDF.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
