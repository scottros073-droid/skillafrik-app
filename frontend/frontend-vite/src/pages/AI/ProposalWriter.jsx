import { useState } from "react";
import axios from "../../utils/axiosInstance";

export default function ProposalWriter() {
  const [job, setJob] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");

  const generate = async () => {
    try {
      const res = await axios.post("/ai/generate/proposal", {
        job,
        skills
      });
      setResult(res.data.proposal);
    } catch (err) {
      alert(err.response?.data?.message || "Error generating");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Proposal Writer</h1>

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Client job description"
        value={job}
        onChange={(e) => setJob(e.target.value)}
      />

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Your skills"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <button
        onClick={generate}
        className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-500"
      >
        Generate Proposal
      </button>

      {result && (
        <textarea
          value={result}
          readOnly
          className="w-full h-64 border p-4 mt-4 rounded"
        />
      )}
    </div>
  );
}
