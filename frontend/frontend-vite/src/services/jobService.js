// src/services/jobService.js
import axiosInstance from "../utils/axiosInstance";

/* ===============================
   PUBLIC JOBS
================================ */

// Get all public jobs (marketplace / job feed)
export const getJobs = async (params) => {
  const { data } = await axiosInstance.get("/jobs", { params });
  return data;
};

// Get single job details
export const getJobById = async (id) => {
  const { data } = await axiosInstance.get(`/jobs/${id}`);
  return data;
};

/* ===============================
   CLIENT (JOB OWNER)
================================ */

// AI Job Description Writer: get basic title + description suggestion (free)
export const getAiJobSuggestion = async (payload) => {
  const { data } = await axiosInstance.post("/jobs/ai-description", payload);
  return data;
};

// Jobs created by logged-in client
export const getUserJobs = async () => {
  const { data } = await axiosInstance.get("/jobs/my-jobs");
  return data;
};

// Create a new job (send title, description, category, budget or price)
export const createJob = async (jobData) => {
  const { data } = await axiosInstance.post("/jobs", jobData);
  return data;
};

// Update job
export const updateJob = async (id, jobData) => {
  const { data } = await axiosInstance.put(`/jobs/${id}`, jobData);
  return data;
};

// Delete job
export const deleteJob = async (id) => {
  const { data } = await axiosInstance.delete(`/jobs/${id}`);
  return data;
};

/* ===============================
   FREELANCER
================================ */

// Jobs assigned to logged-in freelancer
export const getFreelancerJobs = async () => {
  const { data } = await axiosInstance.get("/jobs/freelancer");
  return data;
};

// Jobs a freelancer has applied to
export const getAppliedJobs = async () => {
  const { data } = await axiosInstance.get("/jobs/applied");
  return data;
};

// Accept a job
export const acceptJob = async (jobId) => {
  const { data } = await axiosInstance.post(`/jobs/${jobId}/accept`);
  return data;
};

// Submit completed work
export const submitJob = async (jobId, submission) => {
  const { data } = await axiosInstance.post(`/jobs/${jobId}/submit`, submission);
  return data;
};

/* ===============================
   STATUS FILTERING
================================ */

// Get jobs by status (pending, active, completed, etc)
export const getJobsByStatus = async (status) => {
  const { data } = await axiosInstance.get(`/jobs/status/${status}`);
  return data;
};
