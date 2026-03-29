import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import ServiceCard from "./ServiceCard";
import ServiceDetail from "./ServiceDetail";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (value?.data && Array.isArray(value.data)) return value.data;
  if (value?.jobs && Array.isArray(value.jobs)) return value.jobs;
  if (value?.services && Array.isArray(value.services)) return value.services;
  return [];
};

export default function Marketplace() {
  const [services, setServices] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [actionPending, setActionPending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const categories = [
    "Web Development",
    "Graphic Design",
    "Marketing & SEO",
    "Content Writing",
    "Mobile Apps",
    "AI & Automation",
    "Business",
  ];

  useEffect(() => {
    const controller = new AbortController();
    const MAX_RETRIES = 2;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const [jobsResp, freelancersResp] = await Promise.all([
            axiosInstance.get("/jobs", { signal: controller.signal }),
            axiosInstance.get("/freelancers", { signal: controller.signal }),
          ]);

          setServices(normalizeList(jobsResp?.data));
          setFreelancers(normalizeList(freelancersResp?.data));
          setError(null);
          break;
        } catch (err) {
          if (err.name === "CanceledError" || err.name === "AbortError") {
            return;
          }

          console.error("Marketplace fetch error:", err);
          const message = err?.response?.data?.message || err?.message || "Unexpected network error.";
          setError(`Failed to load marketplace items: ${message}`);

          if (attempt === MAX_RETRIES) {
            break;
          }

          // small base backoff between retries
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }

      if (!controller.signal.aborted) {
        setLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, [retryCount]);

  const safeFreelancers = useMemo(() => normalizeList(freelancers), [freelancers]);
  const safeServices = useMemo(() => normalizeList(services), [services]);

  const filteredServices = useMemo(() => {
    const normalized = safeServices;
    return normalized
      .filter((service) => {
        if (!service) return false;
        if (category && service.category && service.category !== category) return false;
        if (search.trim()) {
          const term = search.trim().toLowerCase();
          const text = `${service.title || ""} ${service.description || ""}`.toLowerCase();
          if (!text.includes(term) && !((service.freelancer?.firstName || "").toLowerCase().includes(term))) {
            return false;
          }
        }
        return true;
      })
      .slice(0, 100); // safety cap
  }, [safeServices, category, search]);

  const handleHireNow = async (service) => {
    if (!service || !service._id || actionPending) return;

    try {
      setActionPending(true);
      const freelancerId = service.freelancer?._id || service.freelancerId || service.userId;
      const payload = {
        freelancerId,
        serviceId: service._id,
        price: service.price ?? 0,
      };

      await axiosInstance.post("/orders", payload);
      setSuccessMessage("Hiring request submitted successfully. Check your dashboard in a moment.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Hire flow error:", err);
      setError("Could not create order right now. Please try again.");
    } finally {
      setActionPending(false);
    }
  };

  const handleMessage = (service) => {
    const freelancerId = service?.freelancer?._id || service?.freelancerId || service?.userId;
    if (!freelancerId) {
      setError("Freelancer contact details missing.");
      return;
    }

    navigate(`/dashboard/chat?freelancerId=${freelancerId}&serviceId=${service?._id}`);
  };

  const hasNoData = !loading && !error && filteredServices.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Browse services, hire talent, and send messages in one place.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div className="flex-1 relative">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services or freelancers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-64 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/50 p-4 text-sm text-red-700 dark:text-red-200">
            <p>{error}</p>
            <button
              onClick={() => setRetryCount((prev) => prev + 1)}
              className="mt-2 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
              type="button"
            >
              Retry
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/50 p-4 text-sm text-green-700 dark:text-green-200">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {loading ? (
              <LoadingSkeleton count={6} />
            ) : hasNoData ? (
              <EmptyState title="No services found" message="Try adjusting your search or category filter." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service._id || service.id || Math.random()}
                    service={service}
                    onViewDetails={(item) => setSelectedService(item)}
                    onHireNow={handleHireNow}
                    onMessage={handleMessage}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top freelancers</h2>
            {loading ? (
              <p className="text-gray-500">Loading freelancers...</p>
            ) : safeFreelancers.length === 0 ? (
              <p className="text-gray-500">No freelancers found.</p>
            ) : (
              <div className="space-y-3">
                {safeFreelancers.slice(0, 8).map((freelancer) => (
                  <div key={freelancer._id || freelancer.id || Math.random()} className="flex items-center gap-3">
                    <img
                      src={freelancer.avatar || "/default-avatar.png"}
                      alt={`${freelancer.firstName || freelancer.name || ""} ${freelancer.lastName || ""}`}
                      onError={(e) => { e.target.src = "/default-avatar.png"; }}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{freelancer.firstName || freelancer.name || "Unknown"} {freelancer.lastName || ""}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{freelancer.title || freelancer.role || "Freelancer"}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/freelancer/profile/${freelancer._id || freelancer.id}`)}
                      className="text-indigo-600 dark:text-indigo-400 text-xs"
                      type="button"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>

        {selectedService && (
          <ServiceDetail
            service={selectedService}
            onBack={() => setSelectedService(null)}
            onHireNow={handleHireNow}
            onMessage={handleMessage}
          />
        )}
      </div>
    </div>
  );
}
