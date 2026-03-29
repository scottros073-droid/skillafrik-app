import axiosInstance from "../utils/axiosInstance";

// Fetch dashboard data (uses GET /api/dashboard with auth)
export const getUserStats = async () => {
  const res = await axiosInstance.get("/dashboard");
  return res.data.stats || res.data;
};

// Fetch categories (can be static or from DB)
export const getCategories = async () => {
  const res = await axiosInstance.get("/categories").catch(() => ({ data: [] }));
  return res.data;
};

// Fetch ads
export const getAds = async () => {
  const res = await axiosInstance.get("/ads");
  return res.data;
};

// Fetch recent jobs
export const getRecentJobs = async () => {
  const res = await axiosInstance.get("/jobs/recent").catch(() => ({ data: [] }));
  return res.data;
};
