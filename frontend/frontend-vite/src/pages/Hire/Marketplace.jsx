import Marketplace from "../../components/marketplace/Marketplace";

export default function MarketplacePage() {
  return <Marketplace />;

  const categories = [
    "Web Development",
    "Graphic Design",
    "Marketing & SEO",
    "Content Writing",
    "Mobile Apps",
    "Other Skills",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const q = new URLSearchParams();
        if (category) q.append("category", category);
        if (search) q.append("search", search);
        if (minBudget) q.append("minBudget", minBudget);
        if (maxBudget) q.append("maxBudget", maxBudget);
        if (skillsFilter) q.append("skills", skillsFilter);
        if (experience) q.append("experience", experience);
        if (location) q.append("location", location);
        if (jobType) q.append("jobType", jobType);
        q.append("page", page);
        q.append("limit", 12);

        const [jobsRes, freelancersRes] = await Promise.all([
          axios.get(`/jobs?${q.toString()}`),
          axios.get("/freelancers"),
        ]);

        setJobs(jobsRes.data.jobs || []);
        setTotalJobs(jobsRes.data.total || 0);
        setFreelancers(freelancersRes.data || []);
      } catch (err) {
        console.error("Marketplace fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, search, minBudget, maxBudget, skillsFilter, experience, location, jobType, page]);

  const filteredJobs = jobs;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Browse jobs, connect with freelancers, and hire with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job listing column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search bar */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <FaSearch className="text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search jobs (e.g., design, react, seo)"
                    className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Budget min</label>
                <input
                  type="number"
                  min={0}
                  value={minBudget}
                  onChange={(e) => { setMinBudget(Number(e.target.value)); setPage(1); }}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Budget max</label>
                <input
                  type="number"
                  min={0}
                  value={maxBudget}
                  onChange={(e) => { setMaxBudget(Number(e.target.value)); setPage(1); }}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Skills</label>
                <input
                  type="text"
                  value={skillsFilter}
                  onChange={(e) => { setSkillsFilter(e.target.value); setPage(1); }}
                  placeholder="react, figma, node"
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Experience</label>
                <select
                  value={experience}
                  onChange={(e) => { setExperience(e.target.value); setPage(1); }}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                  placeholder="e.g., Lagos"
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => { setJobType(e.target.value); setPage(1); }}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All types</option>
                  <option value="hourly">Hourly</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading jobs…</p>
            ) : filteredJobs.length === 0 ? (
              <p className="text-gray-500">No matching jobs found.</p>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{job.category} • {job.client?.firstName || "Client"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">₦{job.budget || job.price || 0}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700 dark:text-gray-300 line-clamp-2">{job.description || "No description provided."}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills?.slice(0, 5).map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaStar className="text-yellow-400" />
                        <span>{job.rating || 0} rating</span>
                        <span>• {job.completedJobs || 0} completed</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/hire/${job._id}`)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                        >
                          Hire Freelancer
                        </button>
                        <button
                          onClick={() => navigate(`/job/${job._id}/proposal`)}
                          className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
                        >
                          Send Proposal
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {jobs.length < totalJobs && (
              <div className="text-center">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
                >
                  Load More
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Top freelancers */}
          <aside className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 h-fit sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top freelancers</h3>
            {loading ? (
              <p className="text-gray-500">Loading freelancers…</p>
            ) : freelancers.length === 0 ? (
              <p className="text-gray-500">No freelancers found.</p>
            ) : (
              <div className="space-y-3">
                {freelancers.slice(0, 8).map((f) => (
                  <div key={f._id} className="flex items-center gap-3">
                    <img
                      src={f.avatar || "/default-avatar.png"}
                      alt={`${f.firstName} ${f.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{f.firstName} {f.lastName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{f.skills?.slice(0, 2).join(", ") || "No skills"}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/freelancer/profile/${f._id}`)}
                      className="text-indigo-600 dark:text-indigo-400 text-xs"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
