/**
 * FreelancerProfile.jsx - Detailed freelancer profile page (Upwork/Fiverr style)
 * 
 * Features:
 * - Beautiful header with avatar, name, title, rating, badges
 * - About section with bio
 * - Skills showcase with clickable tags
 * - Portfolio projects gallery
 * - Reviews and testimonials
 * - Statistics and achievements
 * - Action buttons (Hire, Message, Save)
 * - Responsive design for mobile/tablet/desktop
 * - API integration for profile data
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaTrophy,
  FaCheckCircle,
  FaBriefcase,
  FaMapMarkerAlt,
  FaLink,
  FaArrowRight,
  FaEnvelope,
  FaPlus,
  FaHeart,
} from "react-icons/fa";
import { ProfileSkeleton } from "../components/Loaders";
import { useToast } from "../context/ToastContext";
import { freelancerAPI, jobAPI } from "../services/apiService";
import ProfileHeader from "../components/profile/ProfileHeader";
import AboutSection from "../components/profile/AboutSection";
import SkillsSection from "../components/profile/SkillsSection";
import PortfolioSection from "../components/profile/PortfolioSection";
import ReviewsSection from "../components/profile/ReviewsSection";
import StatsSection from "../components/profile/StatsSection";

/**
 * Main FreelancerProfile Component
 */
export default function FreelancerProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await freelancerAPI.getPublicProfile(userId);
        
        if (response.success) {
          setProfile(response.data);
          setError(null);
        } else {
          setError(response.error || "Failed to load profile");
          toast.error("Could not load profile");
        }
      } catch (err) {
        setError("An error occurred while loading the profile");
        toast.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, toast]);

  // Handle sending proposal/message
  const handleHire = () => {
    navigate(`/dashboard/hire/marketplace?freelancerId=${userId}`, {
      state: { freelancer: profile },
    });
  };

  // Handle save to favorites
  const handleSave = async () => {
    setSaved(!saved);
    toast.success(saved ? "Removed from favorites" : "Saved to favorites");
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || "The profile you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Background Gradient */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950" />

      <div className="max-w-5xl mx-auto px-4 py-8 -mt-20 relative z-10">
        {/* Profile Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          
          {/* Profile Header Section */}
          <ProfileHeader
            profile={profile}
            onHire={handleHire}
            onSave={handleSave}
            saved={saved}
          />

          {/* Stats Section */}
          <StatsSection profile={profile} />

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {["about", "portfolio", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium relative whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "about" && (
              <>
                <AboutSection profile={profile} />
                <SkillsSection profile={profile} />
              </>
            )}

            {activeTab === "portfolio" && <PortfolioSection userId={userId} />}

            {activeTab === "reviews" && <ReviewsSection userId={userId} />}
          </div>
        </div>

        {/* Sticky Action Bar (Mobile) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-40">
          <button
            onClick={handleHire}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaBriefcase />
            Hire This Freelancer
          </button>
        </div>
      </div>
    </div>
  );
}
