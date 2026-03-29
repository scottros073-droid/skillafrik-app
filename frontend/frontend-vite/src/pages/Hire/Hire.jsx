import React, { useState, useEffect } from "react";

export default function Hire({ user }) {
  const [hires, setHires] = useState([]);
  const [jobs, setJobs] = useState([]);

  const fetchHires = async () => {
    const res = await fetch(`http://localhost:5000/hires/${user._id}`);
    const data = await res.json();
    setHires(data);
  };

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:5000/jobs");
    const data = await res.json();
    setJobs(data);
  };

  const handleHire = async (job) => {
    await fetch("http://localhost:5000/hire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job._id, clientId: user._id, workerId: job.createdBy }),
    });
    fetchHires();
  };

  useEffect(() => { fetchJobs(); fetchHires(); }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "auto", paddingTop: "50px" }}>
      {user.role === "Client" && (
        <>
          <h2>All Jobs</h2>
          {jobs.map(job => (
            <div key={job._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <strong>Budget: ${job.budget}</strong><br />
              <button onClick={() => handleHire(job)}>Hire Worker</button>
            </div>
          ))}
        </>
      )}

      <h2>My Hires</h2>
      {hires.map(h => (
        <div key={h._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <p>Job ID: {h.jobId}</p>
          <p>Status: {h.status}</p>
        </div>
      ))}
    </div>
  );
}
