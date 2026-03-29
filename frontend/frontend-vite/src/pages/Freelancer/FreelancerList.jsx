import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";

export default function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchFreelancers = async () => {
      const res = await axios.get("/users/freelancers");
      setFreelancers(res.data);
    };
    fetchFreelancers();
  }, []);

  const filtered = freelancers.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || f.category === category)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search freelancers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {["All", "Web Development", "Graphic Design", "SEO & Marketing", "Mobile Apps", "Writing"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((f) => (
          <Link key={f._id} to={`/freelancer/${f._id}`} className="border p-4 rounded shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold mb-1">{f.name}</h3>
            <p className="text-sm mb-1">{f.category}</p>
            <p className="text-sm">Rating: {f.avgRating || 0} ⭐</p>
            {f.isVerified && <span className="text-green-600 text-xs">Verified</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
