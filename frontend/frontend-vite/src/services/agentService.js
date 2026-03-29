// src/services/agentService.js
import axiosInstance from "../utils/axiosInstance";

/**
 * Enable agent mode for a user
 */
export const enableAgent = async (whatsappLink) => {
  const { data } = await axiosInstance.post("/agent/enable", { whatsappLink });
  return data;
};

/**
 * Disable agent mode
 */
export const disableAgent = async () => {
  const { data } = await axiosInstance.post("/agent/disable");
  return data;
};

/**
 * Get agent profile
 */
export const getAgentProfile = async () => {
  const { data } = await axiosInstance.get("/agent/profile");
  return data;
};

/**
 * Post a job as an agent
 */
export const postAgentJob = async (jobData) => {
  const { data } = await axiosInstance.post("/agent/post-job", jobData);
  return data;
};

/**
 * Get all jobs posted by authenticated agent
 */
export const getAgentJobs = async (status = null) => {
  const params = status ? { status } : {};
  const { data } = await axiosInstance.get("/agent/my-jobs", { params });
  return data;
};

/**
 * Get applicants for a job posted by agent
 */
export const getJobApplicants = async (jobId) => {
  const { data } = await axiosInstance.get(`/agent/applicants/${jobId}`);
  return data;
};

/**
 * Get agent earnings and stats
 */
export const getAgentEarnings = async () => {
  const { data } = await axiosInstance.get("/agent/earnings");
  return data;
};

/**
 * Update agent settings (WhatsApp link, commission rate)
 */
export const updateAgentSettings = async (settings) => {
  const { data } = await axiosInstance.put("/agent/settings", settings);
  return data;
};
