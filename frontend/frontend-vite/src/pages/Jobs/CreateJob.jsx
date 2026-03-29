// frontend/src/pages/Jobs/CreateJob.jsx
import React, { useState } from "react";
import axiosInstance from "../../utils/axios";

export default function CreateJob() {
  const [job, setJob] = useState({ title: "", description: "", budget: "" });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/jobs", job);
      alert("Job created!");
      setJob({ title: "", description: "", budget: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to create job");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow mt-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Create Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={job.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
        />
        <textarea
          name="description"
          value={job.description}
          onChange={handleChange}
          placeholder="Job Description"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="number"
          name="budget"
          value={job.budget}
          onChange={handleChange}
          placeholder="Budget"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent transition"
        >
          Create Job
        </button>
      </form>
    </div>
  );
}
