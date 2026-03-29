import { useState, useEffect } from "react";
import { FaBriefcase, FaPlus, FaEdit, FaTrash, FaGlobe, FaLock, FaImage, FaLink, FaCalendar, FaCheckCircle, FaTimes, FaRobot, FaEye } from "react-icons/fa";
import {
  createPortfolio,
  getUserPortfolios,
  updatePortfolio,
  deletePortfolio,
  addProjectToPortfolio,
  removeProjectFromPortfolio
} from "../../services/aiService";

export default function AIPortfolioBuilder() {
  // Portfolio List State
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    headline: "",
    bio: "",
    skills: "",
    experience: "",
    profileImage: "",
    portfolioColor: "indigo"
  });

  // Project Form State
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    projectUrl: "",
    skills: "",
    completionDate: ""
  });

  // Colors for portfolio theme
  const colors = ["indigo", "blue", "purple", "pink", "emerald", "orange"];

  // Load portfolios on mount
  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const data = await getUserPortfolios();
      setPortfolios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load portfolios:", err);
      setError("Failed to load your portfolios");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Portfolio title is required");
      return;
    }

    try {
      setError("");
      const result = await createPortfolio({
        title: formData.title.trim(),
        headline: formData.headline.trim() || "",
        bio: formData.bio.trim() || "",
        skills: formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        experience: formData.experience.trim() || "",
        profileImage: formData.profileImage.trim() || "",
        portfolioColor: formData.portfolioColor
      });

      setSuccess("✅ Portfolio created successfully!");
      setFormData({ title: "", headline: "", bio: "", skills: "", experience: "", profileImage: "", portfolioColor: "indigo" });
      setShowCreateForm(false);
      loadPortfolios();
    } catch (err) {
      if (err.response?.data?.requiresUpgrade) {
        setError("📦 Free tier limited to 1 portfolio. Upgrade for unlimited portfolios.");
      } else {
        setError(err.response?.data?.message || "Failed to create portfolio");
      }
    }
  };

  const handleUpdatePortfolio = async (portfolio) => {
    try {
      setError("");
      await updatePortfolio(portfolio._id, {
        title: formData.title.trim() || portfolio.title,
        headline: formData.headline.trim() || portfolio.headline,
        bio: formData.bio.trim() || portfolio.bio,
        skills: formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(Boolean) : portfolio.skills,
        experience: formData.experience.trim() || portfolio.experience,
        profileImage: formData.profileImage.trim() || portfolio.profileImage,
        portfolioColor: formData.portfolioColor || portfolio.portfolioColor
      });

      setSuccess("✅ Portfolio updated!");
      setEditingId(null);
      setFormData({ title: "", headline: "", bio: "", skills: "", experience: "", profileImage: "", portfolioColor: "indigo" });
      loadPortfolios();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update portfolio");
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      setError("");
      await deletePortfolio(id);
      setSuccess("✅ Portfolio deleted!");
      loadPortfolios();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete portfolio");
    }
  };

  const handleAddProject = async (e, portfolioId) => {
    e.preventDefault();
    if (!projectData.title.trim()) {
      setError("Project title is required");
      return;
    }

    try {
      setError("");
      await addProjectToPortfolio(portfolioId, {
        title: projectData.title.trim(),
        description: projectData.description.trim() || "",
        imageUrl: projectData.imageUrl.trim() || "",
        projectUrl: projectData.projectUrl.trim() || "",
        skills: projectData.skills ? projectData.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        completionDate: projectData.completionDate || null
      });

      setSuccess("✅ Project added to portfolio!");
      setProjectData({ title: "", description: "", imageUrl: "", projectUrl: "", skills: "", completionDate: "" });
      setShowProjectForm(false);
      setSelectedPortfolioId(null);
      loadPortfolios();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add project");
    }
  };

  const handleRemoveProject = async (portfolioId, index) => {
    if (!confirm("Remove this project?")) return;

    try {
      setError("");
      await removeProjectFromPortfolio(portfolioId, index);
      setSuccess("✅ Project removed!");
      loadPortfolios();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove project");
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading your portfolios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                <FaBriefcase className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Builder</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create professional portfolios to showcase your work</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition flex items-center gap-2"
            >
              <FaPlus /> New Portfolio
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex gap-2 items-start">
            <span className="mt-0.5">❌</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex gap-2 items-start">
            <span className="mt-0.5">✅</span> {success}
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {editingId ? "Edit Portfolio" : "Create New Portfolio"}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              editingId ? handleUpdatePortfolio(portfolios.find(p => p._id === editingId)) : handleCreatePortfolio(e);
            }} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Portfolio Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="My Awesome Portfolio"
                  className={inputClass}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Headline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    placeholder="Senior Full Stack Developer"
                    className={inputClass}
                    value={formData.headline}
                    onChange={(e) => setFormData({...formData, headline: e.target.value})}
                  />
                </div>

                {/* Color Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Theme Color
                  </label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({...formData, portfolioColor: color})}
                        className={`w-10 h-10 rounded-lg transition ${
                          formData.portfolioColor === color ? "ring-2 ring-offset-2 dark:ring-offset-gray-800" : ""
                        } bg-${color}-500`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio / About
                </label>
                <textarea
                  placeholder="Write a brief description about yourself and your work..."
                  className={`${inputClass} min-h-[100px] resize-none`}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Key Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB, Tailwind CSS"
                  className={inputClass}
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Professional Experience
                </label>
                <textarea
                  placeholder="Describe your professional background, achievements, and experience..."
                  className={`${inputClass} min-h-[100px] resize-none`}
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                />
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/profile.jpg"
                  className={inputClass}
                  value={formData.profileImage}
                  onChange={(e) => setFormData({...formData, profileImage: e.target.value})}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
                >
                  {editingId ? "Update Portfolio" : "Create Portfolio"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingId(null);
                    setFormData({ title: "", headline: "", bio: "", skills: "", experience: "", profileImage: "", portfolioColor: "indigo" });
                  }}
                  className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Portfolios Grid */}
        {portfolios.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <FaBriefcase className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No portfolios yet</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first portfolio to showcase your best work</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
            >
              <FaPlus /> Create Portfolio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolios.map((portfolio) => (
              <div key={portfolio._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition">
                {/* Portfolio Header */}
                <div className={`h-24 bg-gradient-to-br from-${portfolio.portfolioColor}-500 to-${portfolio.portfolioColor}-600`} />

                <div className="p-6">
                  {/* Title & Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{portfolio.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{portfolio.headline}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(portfolio._id);
                          setFormData({
                            title: portfolio.title,
                            headline: portfolio.headline,
                            bio: portfolio.bio,
                            skills: portfolio.skills.join(", "),
                            experience: portfolio.experience,
                            profileImage: portfolio.profileImage,
                            portfolioColor: portfolio.portfolioColor
                          });
                          setShowCreateForm(true);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(portfolio._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Bio Preview */}
                  {portfolio.bio && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{portfolio.bio}</p>
                  )}

                  {/* Skills Tags */}
                  {portfolio.skills && portfolio.skills.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {portfolio.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                      {portfolio.skills.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">+{portfolio.skills.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Projects Count & Status */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {portfolio.projects.length} {portfolio.projects.length === 1 ? "project" : "projects"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 ${portfolio.isPublished ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500"}`}>
                        {portfolio.isPublished ? <FaGlobe /> : <FaLock />}
                        {portfolio.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedPortfolioId(portfolio._id);
                        setShowProjectForm(true);
                      }}
                      className="flex-1 py-2 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition flex items-center justify-center gap-2"
                    >
                      <FaPlus /> Add Project
                    </button>
                    <button
                      onClick={() => window.location.href = `/portfolios/${portfolio._id}`}
                      className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
                      title="View Portfolio"
                    >
                      <FaEye /> View
                    </button>
                  </div>

                  {/* Projects List Preview */}
                  {portfolio.projects.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Recent Projects:</p>
                      <div className="space-y-2">
                        {portfolio.projects.slice(0, 2).map((project, idx) => (
                          <div key={idx} className="text-sm">
                            <p className="text-gray-700 dark:text-gray-300 font-medium">{project.title}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1 flex-wrap">
                                {project.skills.slice(0, 2).map((skill) => (
                                  <span key={skill} className="text-xs text-gray-500">#{skill}</span>
                                ))}
                              </div>
                              <button
                                onClick={() => handleRemoveProject(portfolio._id, idx)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Project Modal */}
        {showProjectForm && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full my-8">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Add Project to Portfolio</h3>
                <button
                  onClick={() => {
                    setShowProjectForm(false);
                    setSelectedPortfolioId(null);
                    setProjectData({ title: "", description: "", imageUrl: "", projectUrl: "", skills: "", completionDate: "" });
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded transition"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <form onSubmit={(e) => handleAddProject(e, selectedPortfolioId)}>
                  {/* Project Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="My Awesome Project"
                      className={inputClass}
                      value={projectData.title}
                      onChange={(e) => setProjectData({...projectData, title: e.target.value})}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe what this project is about and your role..."
                      className={`${inputClass} min-h-[80px] resize-none`}
                      value={projectData.description}
                      onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                      <FaImage /> Project Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/project.jpg"
                      className={inputClass}
                      value={projectData.imageUrl}
                      onChange={(e) => setProjectData({...projectData, imageUrl: e.target.value})}
                    />
                  </div>

                  {/* Project URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                      <FaLink /> Project URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://myproject.com"
                      className={inputClass}
                      value={projectData.projectUrl}
                      onChange={(e) => setProjectData({...projectData, projectUrl: e.target.value})}
                    />
                  </div>

                  {/* Skills Used */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Skills Used (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Tailwind"
                      className={inputClass}
                      value={projectData.skills}
                      onChange={(e) => setProjectData({...projectData, skills: e.target.value})}
                    />
                  </div>

                  {/* Completion Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                      <FaCalendar /> Completion Date
                    </label>
                    <input
                      type="date"
                      className={inputClass}
                      value={projectData.completionDate}
                      onChange={(e) => setProjectData({...projectData, completionDate: e.target.value})}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
                    >
                      Add Project
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProjectForm(false);
                        setSelectedPortfolioId(null);
                        setProjectData({ title: "", description: "", imageUrl: "", projectUrl: "", skills: "", completionDate: "" });
                      }}
                      className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
