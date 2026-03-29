// src/pages/Jobs/PostAgentJobPage.jsx
import React, { useState } from "react";
import { postAgentJob } from "../../services/agentService";
import { useNavigate } from "react-router-dom";
import "./JobPostForm.css";

export default function PostAgentJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    jobType: "remote",
    location: "",
    contactLink: "",
    deadline: "",
    currency: "NGN",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.title.trim()) {
      setError("Job title is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Job description is required");
      return;
    }
    if (!formData.budget || formData.budget <= 0) {
      setError("Valid budget is required");
      return;
    }
    if (!formData.category) {
      setError("Category is required");
      return;
    }
    if (formData.jobType === "physical" && !formData.location.trim()) {
      setError("Location is required for physical jobs");
      return;
    }
    if (!formData.contactLink.trim()) {
      setError("Contact link (WhatsApp) is required");
      return;
    }

    try {
      setLoading(true);
      const result = await postAgentJob(formData);
      setSuccess("Job posted successfully!");
      setTimeout(() => {
        navigate(`/jobs/${result.job._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page agent-post-job">
      <div className="job-form-container">
        <h1>Post a Job as Agent</h1>
        <p className="subtitle">
          Post jobs for FREE and earn commissions when freelancers complete them
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="job-form">
          {/* Basic Info */}
          <div className="form-section">
            <h2>Job Details</h2>

            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Need a React developer for e-commerce site"
                required
              />
              <small>Make it clear and specific</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job in detail. Include requirements, deliverables, timeline..."
                rows="6"
                required
              />
              <small>Be as detailed as possible to attract the right freelancer</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Design">Design</option>
                  <option value="Content Writing">Content Writing</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budget">Budget *</label>
                <div className="budget-input">
                  <input
                    id="budget"
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <small>
                  Platform fee: 10% | Your commission: 2-5%
                </small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="deadline">Deadline (Optional)</label>
              <input
                id="deadline"
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Job Type & Location */}
          <div className="form-section">
            <h2>Job Type & Location</h2>

            <div className="form-group">
              <label htmlFor="jobType">Job Type *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="jobType"
                    value="remote"
                    checked={formData.jobType === "remote"}
                    onChange={handleChange}
                  />
                  <span>Remote</span>
                  <small>Work done online</small>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="jobType"
                    value="physical"
                    checked={formData.jobType === "physical"}
                    onChange={handleChange}
                  />
                  <span>Physical / On-site</span>
                  <small>Work done at a specific location</small>
                </label>
              </div>
            </div>

            {formData.jobType === "physical" && (
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Lagos, Nigeria or Onsite Address"
                  required
                />
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="form-section">
            <h2>Contact Information</h2>

            <div className="form-group">
              <label htmlFor="contactLink">WhatsApp Contact Link *</label>
              <input
                id="contactLink"
                type="url"
                name="contactLink"
                value={formData.contactLink}
                onChange={handleChange}
                placeholder="https://wa.me/234..."
                required
              />
              <small>Freelancers will use this to contact you about the job</small>
            </div>
          </div>

          {/* Commission Info */}
          <div className="commission-info">
            <h3>Budget Breakdown</h3>
            <div className="breakdown">
              <div className="breakdown-item">
                <span>Total Job Amount:</span>
                <strong>${formData.budget || "0.00"}</strong>
              </div>
              <div className="breakdown-item platform">
                <span>Platform Fee (10%):</span>
                <strong>${(formData.budget * 0.1).toFixed(2)}</strong>
              </div>
              <div className="breakdown-item">
                <span>Freelancer Receives:</span>
                <strong>${(formData.budget * 0.9).toFixed(2)}</strong>
              </div>
              <p className="info">
                As an agent, you'll earn 2-5% commission on job completion.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-large"
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary btn-large"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
