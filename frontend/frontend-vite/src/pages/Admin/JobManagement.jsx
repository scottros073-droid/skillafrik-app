import React, { useEffect, useState } from "react";
import axios from "../../services/api";

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="job-management">
      <h2>Job Management</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            {job.title} - {job.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobManagement;
