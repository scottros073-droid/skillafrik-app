import { useState } from "react";
import axios from "../../utils/axiosInstance";

export default function AIGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [budget, setBudget] = useState(500);

  const generateProposal = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await axios.post("/ai/proposal", { prompt, budget });
      setResult(res.data.result);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate proposal");
    } finally {
      setLoading(false);
    }
  };

  const generateDesign = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await axios.post("/ai/design", { title: prompt, type: "banner" });
      setResult(`<img src="${res.data.url}" alt="AI Design" class="rounded shadow"/>`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate design");
    } finally {
      setLoading(false);
    }
  };

  const generateCV = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await axios.post("/ai/cv", {
        name: prompt,
        skills: ["JavaScript", "React", "Node.js"],
        experience: ["2 years frontend", "1 year backend"]
      });
      setResult(res.data.result);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold mb-4">AI Generator</h1>

      <input
        type="text"
        placeholder="Enter prompt / client name / CV name..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 rounded border mb-4 dark:bg-gray-800 dark:text-white"
      />

      <div className="flex space-x-4">
        <button onClick={generateProposal} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500">
          Generate Proposal
        </button>
        <button onClick={generateDesign} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
          Generate Design
        </button>
        <button onClick={generateCV} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500">
          Generate CV
        </button>
      </div>

      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded shadow whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result }}>
        {!result && <p className="text-gray-500">{loading ? "Generating..." : "Your AI output will appear here."}</p>}
      </div>
    </div>
  );
}
