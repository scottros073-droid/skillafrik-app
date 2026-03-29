import React, { useState } from "react";
import { createJob } from "../../services/jobService";
import { useNavigate } from "react-router-dom";

export default function PostJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createJob({ title, description, amount, currency });
      navigate("/jobs");
    } catch (err) {
      setError("Failed to post job.");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Post Job</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required />
      <select value={currency} onChange={e => setCurrency(e.target.value)}>
        <option>NGN</option>
        <option>USD</option>
      </select>
      <button type="submit">Post</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
