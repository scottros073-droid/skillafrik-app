import { useState, useEffect } from "react";
import { getJobs } from "../services/jobService";

export default function useJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Unable to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, error, fetchJobs, setJobs };
}
