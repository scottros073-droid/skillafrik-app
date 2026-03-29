import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";

const TestApi = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/jobs");
        setJobs(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Network Error");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Jobs from Backend</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            <strong>{job.title}</strong> - {job.amount} {job.currency}
            <br />
            {job.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestApi;
