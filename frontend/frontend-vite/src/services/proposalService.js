// src/services/proposalService.js
import axiosInstance from "../utils/axiosInstance";

/* ===============================
   PROPOSALS
================================ */

// Submit a proposal for a job
export const submitProposal = async (jobId, proposalData) => {
  const { data } = await axiosInstance.post("/proposals", {
    jobId,
    ...proposalData
  });
  return data;
};

// Get proposals for a specific job
export const getProposalsForJob = async (jobId) => {
  const { data } = await axiosInstance.get(`/proposals/job/${jobId}`);
  return data;
};

// Accept a proposal (client only)
export const acceptProposal = async (proposalId) => {
  const { data } = await axiosInstance.post(`/proposals/${proposalId}/accept`);
  return data;
};

// Reject a proposal (client only)
export const rejectProposal = async (proposalId) => {
  const { data } = await axiosInstance.post(`/proposals/${proposalId}/reject`);
  return data;
};