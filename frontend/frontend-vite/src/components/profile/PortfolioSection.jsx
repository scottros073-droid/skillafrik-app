/**
 * PortfolioSection.jsx - Display freelancer portfolio projects
 */

import React, { useEffect, useState } from "react";
import { FaImage, FaExternalLinkAlt } from "react-icons/fa";
import { portfolioAPI } from "../../services/apiService";
import { CardSkeleton } from "../Loaders";

export default function PortfolioSection({ userId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await portfolioAPI.getProjects(userId, 6);
        if (response.success) {
          setProjects(response.data || []);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  if (loading) return <CardSkeleton />;

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FaImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No portfolio projects yet
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Portfolio
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="group bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Project Image */}
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden relative">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaImage className="w-12 h-12 text-white/50" />
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {project.description}
                </p>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  View Project <FaExternalLinkAlt className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
