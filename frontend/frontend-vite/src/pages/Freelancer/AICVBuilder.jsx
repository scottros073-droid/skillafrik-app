import { useState } from "react";
import { FaFileAlt, FaRobot, FaCheckCircle, FaDownload, FaLock, FaPlus, FaTimes, FaArrowRight, FaMagic } from "react-icons/fa";
import { 
  generateCVPreview, 
  saveCVToProfile, 
  generateCVPDF,
  getSavedCVs
} from "../../services/aiService";

const TEMPLATE_EXAMPLES = {
  web: {
    title: "Full Stack Developer",
    skills: "React, Node.js, MongoDB, Tailwind CSS, REST APIs",
    experience: "5+ years of full-stack web development. Built 20+ production applications.",
    education: "BS Computer Science, XYZ University"
  },
  design: {
    title: "UI/UX Designer",
    skills: "Figma, Adobe XD, UI Design, Prototyping, User Research",
    experience: "3+ years designing digital products for startups and enterprises.",
    education: "Graphic Design Diploma, ABC Institute"
  },
  marketing: {
    title: "Digital Marketing Specialist",
    skills: "SEO, Content Marketing, Social Media, Google Analytics, Paid Ads",
    experience: "4+ years in digital marketing strategy and execution.",
    education: "Marketing BA, DEF University"
  }
};

export default function AICVBuilder() {
  // Form state
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");

  // UI state
  const [generateLoading, setGenerateLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Generated CV state
  const [generated, setGenerated] = useState(null);
  const [savedCVs, setSavedCVs] = useState([]);
  const [saveName, setSaveName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleApplyTemplate = (template) => {
    const example = TEMPLATE_EXAMPLES[template];
    setTitle(example.title);
    setSkills(example.skills);
    setExperience(example.experience);
    setEducation(example.education);
    setSuccess(`✨ ${template.charAt(0).toUpperCase() + template.slice(1)} template applied!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleGeneratePreview = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!skills.trim()) {
      setError("At least one skill is required");
      return;
    }

    setGenerateLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await generateCVPreview({
        name: name.trim(),
        title: title.trim() || "Professional",
        skills: skills.trim(),
        experience: experience.trim() || "Not specified",
        education: education.trim() || "Not specified"
      });

      setGenerated({
        cvText: result.cvText,
        coverLetter: result.coverLetter || ""
      });
      setSuccess("✅ CV preview generated!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate CV preview");
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleSaveCV = async () => {
    if (!saveName.trim()) {
      setError("CV name is required");
      return;
    }

    setSaveLoading(true);
    setError("");

    try {
      await saveCVToProfile({
        name: saveName.trim(),
        title: title.trim() || "Professional",
        cvText: generated.cvText,
        coverLetter: generated.coverLetter || ""
      });

      setSuccess("✅ CV saved to your profile!");
      setShowSaveModal(false);
      setSaveName("");
      
      // Refresh saved CVs
      const updated = await getSavedCVs();
      setSavedCVs(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save CV");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    setError("");

    try {
      const pdfBlob = await generateCVPDF({
        name: name.trim(),
        title: title.trim() || "Professional",
        skills: skills.trim(),
        experience: experience.trim() || "Not specified",
        education: education.trim() || "Not specified"
      });

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name.replace(/\s+/g, "_")}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setSuccess("✅ CV downloaded!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to download PDF";
      if (msg.includes("Premium") || msg.includes("Upgrade")) {
        setError("📦 Premium feature - Upgrade to download PDF");
      } else {
        setError(msg);
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
              <FaRobot className="text-white text-lg" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI CV Builder</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Create a professional CV in seconds. Free preview, premium PDF download.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaMagic /> Quick Templates
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(TEMPLATE_EXAMPLES).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleApplyTemplate(key)}
                    className="p-3 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition text-sm capitalize"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Inputs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Information</h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Professional Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  placeholder="Full Stack Developer"
                  className={inputClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skills <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB, REST APIs (separate with commas)"
                  className={inputClass}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">List your key skills separated by commas</p>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience
                </label>
                <textarea
                  placeholder="Describe your work experience, projects, and achievements..."
                  className={`${inputClass} min-h-[100px] resize-none`}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Education
                </label>
                <input
                  type="text"
                  placeholder="BS Computer Science, University of Technology"
                  className={inputClass}
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex gap-2">
                  <span>❌</span> {error}
                </div>
              )}
              {success && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-300 flex gap-2">
                  <span>✅</span> {success}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGeneratePreview}
                disabled={generateLoading}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generateLoading ? (
                  <>⏳ Generating...</>
                ) : (
                  <>
                    <FaRobot /> Generate CV Preview
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            {/* Preview Card */}
            {generated ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaFileAlt /> Preview
                </h3>

                {/* CV Preview Text */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-600">
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono break-words">
                    {generated.cvText}
                  </pre>
                </div>

                {/* Cover Letter Preview */}
                {generated.coverLetter && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-200 mb-2">Cover Letter Sample:</p>
                    <p className="text-xs text-blue-800 dark:text-blue-300 line-clamp-3">{generated.coverLetter}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Save Button */}
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="w-full py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle /> Save CV
                  </button>

                  {/* Download PDF Button */}
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloadLoading}
                    className="w-full py-2 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {downloadLoading ? (
                      <>⏳ Downloading...</>
                    ) : (
                      <>
                        <FaDownload /> Download PDF
                      </>
                    )}
                  </button>

                  {/* Generate Another */}
                  <button
                    onClick={() => setGenerated(null)}
                    className="w-full py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    ← Back to Edit
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <FaFileAlt className="text-4xl mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Generate a CV preview to see it here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Save This CV</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  CV Name <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  placeholder="e.g., Full Stack Developer CV"
                  className={inputClass}
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  autoFocus
                />
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCV}
                  disabled={saveLoading || !saveName.trim()}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50"
                >
                  {saveLoading ? "Saving..." : "Save CV"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
