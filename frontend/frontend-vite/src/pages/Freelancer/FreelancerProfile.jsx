import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { FaStar, FaEnvelope, FaBriefcase, FaGlobe, FaCheckCircle } from "react-icons/fa";
import PageContainer from "../../components/ui/PageContainer";

export default function FreelancerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [freelancerData, setFreelancerData] = useState(null);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposal, setProposal] = useState({ coverLetter: "", price: "", deliveryDays: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [profileRes, reviewRes] = await Promise.all([
          axios.get(`/freelancers/${id}`),
          axios.get(`/reviews/freelancer/${id}`),
        ]);
        setFreelancerData(profileRes.data);
        setReviews(reviewRes.data || []);
      } catch (err) {
        console.error("Failed to load freelancer profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const leadProposal = async () => {
    try {
      await axios.post("/proposals", {
        jobId: proposal.jobId || null,
        coverLetter: proposal.coverLetter,
        proposedPrice: Number(proposal.price),
        deliveryDays: Number(proposal.deliveryDays),
      });
      setMessage("Proposal sent successfully");
      setProposalOpen(false);
    } catch (err) {
      console.error("Failed to send proposal", err);
      setMessage(err.response?.data?.message || "Failed to send proposal");
    }
  };

  if (loading) return <PageContainer title="Freelancer Profile">Loading profile...</PageContainer>;

  if (!freelancerData) return <PageContainer title="Freelancer Profile">Freelancer not found</PageContainer>;

  const avgRating =
    reviews.length === 0
      ? 0
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <PageContainer
      title={`${freelancerData.firstName} ${freelancerData.lastName}`}
      subtitle={freelancerData.title || "Freelancer"}
      maxWidth="max-w-6xl"
    >
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">{message}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <img
            src={freelancerData.avatar || "/default-avatar.png"}
            alt="Ava"
            className="w-28 h-28 rounded-full mx-auto"
          />
          <h2 className="text-center text-2xl font-bold mt-4">{freelancerData.firstName} {freelancerData.lastName}</h2>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">{freelancerData.location || "Unknown location"}</p>

          <div className="mt-4 space-y-2">
            <p><FaStar className="inline text-yellow-400 mr-1" />{avgRating} ({reviews.length} reviews)</p>
            <p><FaBriefcase className="inline mr-1" />{freelancerData.completedJobs || 0} jobs completed</p>
            <p><FaGlobe className="inline mr-1" />{freelancerData.country || freelancerData.location || "N/A"}</p>
            <p><FaCheckCircle className="inline text-green-500 mr-1" />{freelancerData.isVerified ? "Verified" : "Not Verified"}</p>
          </div>

          <div className="mt-6 space-y-2">
            <button
              className="w-full py-2 bg-indigo-600 text-white rounded-lg"
              onClick={() => navigate(`/hire/${freelancerData._id}`)}
            >
              Hire Freelancer
            </button>
            <button
              className="w-full py-2 border border-indigo-600 text-indigo-600 rounded-lg"
              onClick={() => setProposalOpen(true)}
            >
              Send Proposal
            </button>
            <button
              className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg"
              onClick={() => navigate(`/chat/${freelancerData._id}`)}
            >
              Message
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg">About</h3>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{freelancerData.bio || "This freelancer hasn't added an about section yet."}</p>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(freelancerData.skills || []).map((skill) => (
                <span key={skill} className="text-xs bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-200 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg">Portfolio</h3>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {(freelancerData.portfolio || []).slice(0, 6).map((item) => (
                <a
                  key={item._id || item.link}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                >
                  <p className="font-medium">{item.title || item.link}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description || "View project"}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg">Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500 mt-3">No reviews yet.</p>
            ) : (
              <div className="space-y-3 mt-3">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b pb-3">
                    <p className="font-semibold">{r.reviewer?.name || "Anonymous"}</p>
                    <p className="text-sm text-gray-500">{r.comment}</p>
                    <p className="text-xs text-gray-500 mt-1">Rating: {r.rating}/5</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {proposalOpen && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-indigo-500">
          <h3 className="font-semibold text-lg">Send a Proposal</h3>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <textarea
              value={proposal.coverLetter}
              onChange={(e) => setProposal({ ...proposal, coverLetter: e.target.value })}
              placeholder="Describe why you are a great fit..."
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              rows={4}
            />
            <input
              type="number"
              value={proposal.price}
              onChange={(e) => setProposal({ ...proposal, price: e.target.value })}
              placeholder="Proposed price"
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <input
              type="number"
              value={proposal.deliveryDays}
              onChange={(e) => setProposal({ ...proposal, deliveryDays: e.target.value })}
              placeholder="Delivery days"
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={leadProposal} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Send Proposal</button>
            <button onClick={() => setProposalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
