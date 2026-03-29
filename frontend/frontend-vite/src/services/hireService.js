import axios from "../utils/axiosInstance";

/* ========================= */
/* Hire / Job Service        */
/* ========================= */

/**
 * Get all applications for a specific job
 * @param {string} jobId
 * @returns {Promise<Array>} list of applicants
 */
export const getJobApplications = async (jobId) => {
  try {
    const res = await axios.get(`/jobs/${jobId}/applications`);
    return res.data; // should return array of applicants
  } catch (err) {
    console.error("Error fetching job applications:", err);
    throw err;
  }
};

/**
 * Hire a freelancer for a job (client pays escrow)
 * @param {string} jobId
 * @param {string} freelancerId
 */
export const hireFreelancer = async (jobId, freelancerId) => {
  try {
    const res = await axios.post(`/jobs/${jobId}/hire`, { freelancerId });
    return res.data;
  } catch (err) {
    console.error("Error hiring freelancer:", err);
    throw err;
  }
};

/**
 * Apply to hire a freelancer (send a hire request)
 * @param {string} freelancerId
 * @param {Object} data - job details
 */
export const applyToHire = async (freelancerId, data) => {
  try {
    const res = await axios.post(`/hire/${freelancerId}`, data);
    return res.data;
  } catch (err) {
    console.error("Error applying to hire:", err);
    throw err;
  }
};

/**
 * Create a new marketplace hire/job
 * @param {Object} data - job details
 */
export const createHire = async (data) => {
  try {
    const res = await axios.post("/hire", data);
    return res.data;
  } catch (err) {
    console.error("Error creating hire:", err);
    throw err;
  }
};

/**
 * Fetch all marketplace jobs with optional filters
 * @param {Object} params - optional filters (category, search, etc.)
 */
export const getMarketplaceJobs = async (params = {}) => {
  try {
    const res = await axios.get("/hire/marketplace", { params });
    return res.data;
  } catch (err) {
    console.error("Error fetching marketplace jobs:", err);
    throw err;
  }
};

/**
 * Fetch a single hire/job by ID
 * @param {string} hireId
 */
export const getHire = async (hireId) => {
  try {
    const res = await axios.get(`/hire/${hireId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching hire:", err);
    throw err;
  }
};

/**
 * Update an existing hire/job
 * @param {string} hireId
 * @param {Object} data
 */
export const updateHire = async (hireId, data) => {
  try {
    const res = await axios.put(`/hire/${hireId}`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating hire:", err);
    throw err;
  }
};

/**
 * Delete a hire/job
 * @param {string} hireId
 */
export const deleteHire = async (hireId) => {
  try {
    const res = await axios.delete(`/hire/${hireId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting hire:", err);
    throw err;
  }
};
