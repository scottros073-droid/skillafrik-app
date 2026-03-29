// src/pages/Dashboard/AgentDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  getAgentProfile,
  getAgentJobs,
  getAgentEarnings,
  getJobApplicants,
  enableAgent,
  updateAgentSettings,
} from "../../services/agentService";
import "./AgentDashboard.css";

export default function AgentDashboard({ user, onAgentStatusChange }) {
  const [isAgent, setIsAgent] = useState(user?.isAgent || false);
  const [agentJobs, setAgentJobs] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, jobs, earnings
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  // Load agent data when component mounts
  useEffect(() => {
    if (isAgent) {
      loadAgentData();
    }
  }, [isAgent]);

  const loadAgentData = async () => {
    try {
      setLoading(true);
      const [profileData, jobsData, earningsData] = await Promise.all([
        getAgentProfile().catch(() => null),
        getAgentJobs().catch(() => []),
        getAgentEarnings().catch(() => null),
      ]);

      if (profileData) {
        setWhatsappLink(profileData.agentSettings?.whatsappLink || "");
      }
      setAgentJobs(jobsData);
      setEarnings(earningsData);
      setError("");
    } catch (err) {
      setError("Failed to load agent data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableAgent = async (e) => {
    e.preventDefault();
    if (!whatsappLink.trim()) {
      setError("WhatsApp link is required");
      return;
    }

    try {
      setLoading(true);
      await enableAgent(whatsappLink);
      setIsAgent(true);
      setSuccess("Agent mode enabled!");
      setError("");
      if (onAgentStatusChange) onAgentStatusChange(true);
      setTimeout(() => setSuccess(""), 3000);
      loadAgentData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enable agent mode");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      setLoading(true);
      await updateAgentSettings({ whatsappLink });
      setSuccess("Settings updated!");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = async (jobId) => {
    try {
      const data = await getJobApplicants(jobId);
      setApplicants(data.applicants || []);
      setSelectedJob(jobId);
    } catch (err) {
      setError("Failed to load applicants");
    }
  };

  // Not Agent - Enable View
  if (!isAgent) {
    return (
      <div className="agent-dashboard agent-not-enabled">
        <div className="agent-card">
          <h2>🚀 Become an Agent</h2>
          <p>Post jobs and earn commissions when freelancers complete them!</p>

          <div className="agent-benefits">
            <div className="benefit">
              <h3>✓ Post Jobs FREE</h3>
              <p>No upfront fees for posting jobs</p>
            </div>
            <div className="benefit">
              <h3>💰 Earn Commissions</h3>
              <p>Earn 2-5% commission on each completed job</p>
            </div>
            <div className="benefit">
              <h3>📊 Track Earnings</h3>
              <p>Monitor all your agent earnings in real-time</p>
            </div>
          </div>

          <form onSubmit={handleEnableAgent} className="agent-form">
            <div className="form-group">
              <label>WhatsApp Contact Link *</label>
              <input
                type="url"
                placeholder="https://wa.me/234..."
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
                required
              />
              <small>Freelancers will use this to contact you</small>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-large"
            >
              {loading ? "Enabling..." : "Enable Agent Mode"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Agent Dashboard View
  return (
    <div className="agent-dashboard">
      <div className="agent-header">
        <h1>Agent Dashboard</h1>
        <p>Manage your jobs, track earnings, and grow your agency</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Tabs */}
      <div className="agent-tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === "jobs" ? "active" : ""}`}
          onClick={() => setActiveTab("jobs")}
        >
          My Jobs ({agentJobs.length})
        </button>
        <button
          className={`tab ${activeTab === "earnings" ? "active" : ""}`}
          onClick={() => setActiveTab("earnings")}
        >
          Earnings
        </button>
        <button
          className={`tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Jobs Posted</h3>
              <div className="stat-value">{agentJobs.length}</div>
            </div>
            <div className="stat-card">
              <h3>Completed Jobs</h3>
              <div className="stat-value">
                {earnings?.completedAgentJobs || 0}
              </div>
            </div>
            <div className="stat-card">
              <h3>Total Earnings</h3>
              <div className="stat-value">
                ${earnings?.totalEarned?.toFixed(2) || "0.00"}
              </div>
            </div>
            <div className="stat-card">
              <h3>Pending Earnings</h3>
              <div className="stat-value">
                ${earnings?.pendingEarnings?.toFixed(2) || "0.00"}
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <a href="/jobs/post-agent" className="btn btn-primary">
              + Post New Job
            </a>
            <button onClick={() => setActiveTab("jobs")} className="btn btn-secondary">
              View My Jobs
            </button>
          </div>
        </div>
      )}

      {/* My Jobs Tab */}
      {activeTab === "jobs" && (
        <div className="tab-content">
          {loading ? (
            <div className="loading">Loading jobs...</div>
          ) : agentJobs.length === 0 ? (
            <div className="empty-state">
              <p>No jobs posted yet</p>
              <a href="/jobs/post-agent" className="btn btn-primary">
                Post Your First Job
              </a>
            </div>
          ) : (
            <div className="jobs-list">
              {agentJobs.map((job) => (
                <div key={job._id} className="job-card">
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span className={`status-badge status-${job.status}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="job-description">
                    {job.description.substring(0, 150)}...
                  </p>
                  <div className="job-meta">
                    <span>${job.budget}</span>
                    {job.jobType === "physical" && (
                      <span className="location">{job.location}</span>
                    )}
                  </div>
                  <div className="job-actions">
                    <button
                      onClick={() => handleViewApplicants(job._id)}
                      className="btn btn-sm btn-secondary"
                    >
                      View Applicants
                    </button>
                    <a href={`/jobs/${job._id}`} className="btn btn-sm btn-outline">
                      Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Applicants Modal */}
          {selectedJob && (
            <div className="applicants-modal">
              <div className="modal-content">
                <h3>Job Applicants</h3>
                {applicants.length === 0 ? (
                  <p>No applicants yet</p>
                ) : (
                  <div className="applicants-list">
                    {applicants.map((app) => (
                      <div key={app._id} className="applicant-card">
                        <div className="applicant-header">
                          <strong>{app.freelancer?.firstName} {app.freelancer?.lastName}</strong>
                          <span className="rating">
                            ⭐ {app.freelancer?.rating || "New"}
                          </span>
                        </div>
                        <p className="email">{app.freelancer?.email}</p>
                        <div className="skills">
                          {app.freelancer?.skills?.slice(0, 3).map((skill) => (
                            <span key={skill} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setSelectedJob(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === "earnings" && (
        <div className="tab-content">
          {earnings ? (
            <div className="earnings-view">
              <div className="earnings-summary">
                <div className="earning-stat">
                  <h4>Total Earned</h4>
                  <div className="amount">${earnings.totalEarned?.toFixed(2) || "0.00"}</div>
                </div>
                <div className="earning-stat">
                  <h4>Pending Earnings</h4>
                  <div className="amount pending">
                    ${earnings.pendingEarnings?.toFixed(2) || "0.00"}
                  </div>
                </div>
                <div className="earning-stat">
                  <h4>Completed Jobs</h4>
                  <div className="amount">{earnings.completedAgentJobs}</div>
                </div>
              </div>

              {earnings.recentTransactions && earnings.recentTransactions.length > 0 && (
                <div className="transactions">
                  <h3>Recent Transactions</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.recentTransactions.map((txn) => (
                        <tr key={txn._id}>
                          <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                          <td>{txn.description}</td>
                          <td>${txn.amount.toFixed(2)}</td>
                          <td>
                            <span className={`status-badge status-${txn.status}`}>
                              {txn.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">No earnings data available yet</div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="tab-content">
          <div className="settings-form">
            <h3>Agent Settings</h3>
            <div className="form-group">
              <label>WhatsApp Contact Link</label>
              <input
                type="url"
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
                placeholder="https://wa.me/234..."
              />
              <small>Update your contact information</small>
            </div>

            <button
              onClick={handleUpdateSettings}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
