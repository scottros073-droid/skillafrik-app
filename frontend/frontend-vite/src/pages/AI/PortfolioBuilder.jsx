// frontend/frontend-vite/src/pages/AI/PortfolioBuilder.jsx
import { useState } from "react";
import { FaMagic, FaEye, FaSave, FaEdit, FaPlus } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import { useUser } from "../../context/UserContext";

export default function PortfolioBuilder() {
  const { user } = useUser();
  const [portfolioData, setPortfolioData] = useState({
    title: "",
    headline: "",
    bio: "",
    skills: [],
    projects: [],
    theme: "indigo"
  });
  const [currentProject, setCurrentProject] = useState({
    title: "",
    description: "",
    skills: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

  const generateSuggestions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post("/ai/generate/portfolio-suggestions", {
        skills: portfolioData.skills,
        experience: portfolioData.bio,
        projects: portfolioData.projects
      });
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error("Failed to generate suggestions:", err);
      alert("Failed to generate suggestions");
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = async (projectIndex) => {
    const project = portfolioData.projects[projectIndex];
    if (!project) return;

    try {
      const res = await axiosInstance.post("/ai/generate/portfolio-description", {
        projectTitle: project.title,
        projectDescription: project.description,
        skills: project.skills
      });

      const updatedProjects = [...portfolioData.projects];
      updatedProjects[projectIndex].description = res.data.description;
      setPortfolioData({ ...portfolioData, projects: updatedProjects });
    } catch (err) {
      console.error("Failed to generate description:", err);
      alert("Failed to generate description");
    }
  };

  const previewPortfolio = async () => {
    try {
      const res = await axiosInstance.post("/ai/preview/portfolio", {
        portfolioData
      });
      setPreview(res.data.preview);
    } catch (err) {
      console.error("Failed to generate preview:", err);
      alert("Failed to generate preview");
    }
  };

  const addProject = () => {
    if (!currentProject.title.trim()) return;

    const newProject = {
      ...currentProject,
      skills: currentProject.skills.split(",").map(s => s.trim()).filter(s => s)
    };

    setPortfolioData({
      ...portfolioData,
      projects: [...portfolioData.projects, newProject]
    });

    setCurrentProject({
      title: "",
      description: "",
      skills: "",
      imageUrl: ""
    });
  };

  const removeProject = (index) => {
    const updatedProjects = portfolioData.projects.filter((_, i) => i !== index);
    setPortfolioData({ ...portfolioData, projects: updatedProjects });
  };

  const applySuggestion = (field, value) => {
    setPortfolioData({ ...portfolioData, [field]: value });
  };

  if (!user) {
    return (
      <PageContainer title="AI Portfolio Builder" subtitle="Please log in to use the portfolio builder">
        <Card>
          <p className="text-center py-8 text-gray-500">
            You need to be logged in to use the AI portfolio builder.
          </p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="AI Portfolio Builder"
      subtitle="Create stunning portfolios with AI assistance"
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder Panel */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Portfolio Basics</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Portfolio Title</label>
                <input
                  type="text"
                  value={portfolioData.title}
                  onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., John Doe's Portfolio"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={portfolioData.headline}
                  onChange={(e) => setPortfolioData({ ...portfolioData, headline: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Full-Stack Developer & UI/UX Designer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio/About</label>
                <textarea
                  value={portfolioData.bio}
                  onChange={(e) => setPortfolioData({ ...portfolioData, bio: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Tell your professional story..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={portfolioData.skills.join(", ")}
                  onChange={(e) => setPortfolioData({
                    ...portfolioData,
                    skills: e.target.value.split(",").map(s => s.trim()).filter(s => s)
                  })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="React, Node.js, Python, UI/UX Design"
                />
              </div>
            </div>
          </Card>

          {/* Projects */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Projects</h3>

            {/* Add Project Form */}
            <div className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <input
                type="text"
                value={currentProject.title}
                onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                placeholder="Project title"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <textarea
                value={currentProject.description}
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                placeholder="Project description"
                rows={2}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={currentProject.skills}
                onChange={(e) => setCurrentProject({ ...currentProject, skills: e.target.value })}
                placeholder="Skills used (comma separated)"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={addProject}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                <FaPlus />
                Add Project
              </button>
            </div>

            {/* Projects List */}
            <div className="space-y-3">
              {portfolioData.projects.map((project, index) => (
                <div key={index} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {project.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Skills: {project.skills.join(", ")}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => generateDescription(index)}
                        className="p-1 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 rounded"
                        title="AI Generate Description"
                      >
                        <FaMagic className="text-sm" />
                      </button>
                      <button
                        onClick={() => removeProject(index)}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        title="Remove Project"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={generateSuggestions}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
            >
              <FaMagic />
              {loading ? "Generating..." : "Get AI Suggestions"}
            </button>
            <button
              onClick={previewPortfolio}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaEye />
              Preview Portfolio
            </button>
          </div>
        </div>

        {/* Preview/Suggestions Panel */}
        <div className="space-y-6">
          {/* AI Suggestions */}
          {suggestions && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Suggested Headline</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={suggestions.headlineSuggestion}
                      readOnly
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => applySuggestion("headline", suggestions.headlineSuggestion)}
                      className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Suggested Bio</label>
                  <div className="flex gap-2">
                    <textarea
                      value={suggestions.bioSuggestion}
                      readOnly
                      rows={3}
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => applySuggestion("bio", suggestions.bioSuggestion)}
                      className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 self-start"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Portfolio Score</label>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm">
                      <strong>Grade:</strong> {suggestions.overallScore}
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Theme:</strong> {suggestions.themeRecommendation}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Portfolio Preview */}
          {preview && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">Portfolio Preview</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{preview.title}</h4>
                  <p className="text-indigo-600 font-medium">{preview.headline}</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{preview.bio}</p>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {preview.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Projects</h5>
                  <div className="space-y-3">
                    {preview.projects.slice(0, 2).map((project, index) => (
                      <div key={index} className="p-3 border border-gray-200 dark:border-gray-600 rounded">
                        <h6 className="font-medium">{project.title}</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}