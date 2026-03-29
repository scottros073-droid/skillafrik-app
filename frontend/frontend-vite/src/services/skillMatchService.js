import axiosInstance from "../utils/axiosInstance";

/**
 * Fetch AI-matched jobs for the logged-in freelancer (top 3).
 * Free: 3 requests per day; response includes usage and limit.
 */
export async function getMatchedJobs() {
  const res = await axiosInstance.get("/skill-match");
  return res.data;
}
