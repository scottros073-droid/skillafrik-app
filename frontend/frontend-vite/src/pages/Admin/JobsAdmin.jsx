import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

export default function JobsAdmin() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const res = await axiosInstance.get('/admin/jobs');
    setJobs(res.data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const release = async (id) => {
    await axiosInstance.post(`/payments/admin/escrow/${id}/approve`);
    fetchJobs();
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Jobs</h3>
      {jobs.map(j => (
        <div key={j._id} style={{ border: '1px solid #ddd', padding: 10, margin: '8px 0' }}>
          <div>title: {j.title}</div>
          <div>escrow: {j.escrow?.amount} ({j.escrow?.status})</div>
          <button onClick={() => release(j._id)}>Force Release</button>
        </div>
      ))}
    </div>
  );
}
