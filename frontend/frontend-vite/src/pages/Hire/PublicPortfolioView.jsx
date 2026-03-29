import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaImage, FaLink, FaCalendar, FaArrowLeft, FaEye, FaBriefcase, FaUser } from "react-icons/fa";
import { getPortfolioById } from "../../services/aiService";

export default function PublicPortfolioView() {
  const { portfolioId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const data = await getPortfolioById(portfolioId);
        setPortfolio(data);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
        setError(err.response?.data?.message || "Portfolio not found or is private");
      } finally {
        setLoading(false);
      }
    };

    if (portfolioId) fetchPortfolio();
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center max-w-md">
          <FaBriefcase className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-lg text-gray-900 dark:text-white mb-2">Portfolio Not Found</p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
          >
            <FaArrowLeft /> Back Home
          </a>
        </div>
      </div>
    );
  }

  const colorClasses = {
    indigo: "from-indigo-500 to-indigo-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    pink: "from-pink-500 to-pink-600",
    emerald: "from-emerald-500 to-emerald-600",
    orange: "from-orange-500 to-orange-600"
  };

  const gradientClass = colorClasses[portfolio.portfolioColor] || colorClasses.indigo;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-br ${gradientClass} text-white`}>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <a href="/" className="inline-flex items-center gap-2 mb-6 opacity-80 hover:opacity-100 transition">
            <FaArrowLeft /> Back
          </a>

          <div className="flex items-start gap-6">
            {portfolio.profileImage && (
              <img
                src={portfolio.profileImage}
                alt={portfolio.title}
                className="w-24 h-24 rounded-lg border-4 border-white/20 object-cover"
              />
            )}

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{portfolio.title}</h1>
              {portfolio.headline && (
                <p className="text-xl text-white/90 mb-4">{portfolio.headline}</p>
              )}

              <div className="flex items-center gap-6 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  <FaBriefcase /> {portfolio.projects.length} {portfolio.projects.length === 1 ? "project" : "projects"}
                </span>
                <span className="flex items-center gap-2">
                  <FaEye /> {portfolio.views} {portfolio.views === 1 ? "view" : "views"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {portfolio.bio && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {portfolio.bio}
                </p>
              </div>
            )}

            {/* Experience Section */}
            {portfolio.experience && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Experience</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {portfolio.experience}
                </p>
              </div>
            )}

            {/* Projects Section */}
            {portfolio.projects && portfolio.projects.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Projects</h2>
                <div className="space-y-6">
                  {portfolio.projects.map((project, idx) => (
                    <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-6">
                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-40 h-32 rounded-lg object-cover flex-shrink-0"
                          />
                        )}

                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {project.title}
                          </h3>

                          {project.description && (
                            <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                              {project.description}
                            </p>
                          )}

                          {/* Skills */}
                          {project.skills && project.skills.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                              {project.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Links & Date */}
                          <div className="flex items-center gap-4 text-sm">
                            {project.projectUrl && (
                              <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2"
                              >
                                <FaLink /> View Project
                              </a>
                            )}

                            {project.completionDate && (
                              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <FaCalendar /> {new Date(project.completionDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Skills Card */}
            {portfolio.skills && portfolio.skills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
                <div className="space-y-2">
                  {portfolio.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Card */}
            {portfolio.userId && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaUser /> About Creator
                </h3>
                {portfolio.userId.firstName && (
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {portfolio.userId.firstName} {portfolio.userId.lastName}
                  </p>
                )}
                {portfolio.userId.email && (
                  <a
                    href={`mailto:${portfolio.userId.email}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm mt-2 inline-block"
                  >
                    Contact
                  </a>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800 mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <FaEye /> This portfolio has been viewed {portfolio.views} times
              </p>
              {portfolio.lastViewed && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Last viewed: {new Date(portfolio.lastViewed).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
