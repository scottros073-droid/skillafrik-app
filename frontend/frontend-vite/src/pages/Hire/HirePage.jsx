import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getHire,
  getJobApplications,
  applyToHire,
  hireFreelancer,
} from "../../services/hireService";

export default function HirePage({ user }) {
  const { jobId } = useParams();

  // ================= New Hire Form =================
  const [form, setForm] = useState({
    freelancerId: "",
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await applyToHire(form.freelancerId, {
        ...form,
        clientId: user._id,
        clientEmail: user.email,
      });
      setFormMessage("Hire request sent! Escrow held successfully.");
      setForm({ freelancerId: "", title: "", description: "", price: "", category: "" });
    } catch (err) {
      console.error(err);
      setFormMessage(err.response?.data?.message || "Error sending hire request.");
    } finally {
      setFormLoading(false);
    }
  };

  // ================= Job Applicants =================
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    const fetchApplicants = async () => {
      setApplicantsLoading(true);
      try {
        const res = await getJobApplications(jobId);
        setApplicants(res.data || []); // assuming axios returns {data: [...]}
      } catch (err) {
        console.error(err);
        setApplicants([]);
      } finally {
        setApplicantsLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleHire = async (freelancerId) => {
    try {
      await hireFreelancer(jobId, freelancerId);
      alert("Freelancer hired! Payment will go to escrow.");
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === freelancerId ? { ...a, hired: true } : a
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to hire freelancer");
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen space-y-10">

      {/* ================= New Hire Form ================= */}
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Hire a Freelancer</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="freelancerId"
            placeholder="Freelancer ID"
            value={form.freelancerId}
            onChange={handleChange}
            className="w-full p-3 rounded border"
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 rounded border"
            required
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 rounded border"
          />
          <input
            type="number"
            name="price"
            placeholder="Price ($)"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 rounded border"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Web Development)"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 rounded border"
          />
          <button
            type="submit"
            disabled={formLoading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-500 disabled:opacity-50"
          >
            {formLoading ? "Sending..." : "Send Hire Request"}
          </button>
        </form>
        {formMessage && <p className="mt-4 text-center text-gray-700">{formMessage}</p>}
      </div>

      {/* ================= Job Applicants ================= */}
      {jobId && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Applicants</h2>
          {applicantsLoading ? (
            <p>Loading applicants...</p>
          ) : applicants.length === 0 ? (
            <p>No applicants yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applicants.map((app) => (
                <div key={app._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
                  <h3 className="font-semibold text-lg">{app.name}</h3>
                  <p className="text-gray-500">{app.skills?.join(", ")}</p>
                  <p className="text-indigo-600 font-bold">${app.bid}</p>
                  <button
                    disabled={app.hired}
                    className={`mt-3 px-4 py-2 rounded-lg text-white ${
                      app.hired ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
                    }`}
                    onClick={() => handleHire(app._id)}
                  >
                    {app.hired ? "Hired" : "Hire & Pay Escrow"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
