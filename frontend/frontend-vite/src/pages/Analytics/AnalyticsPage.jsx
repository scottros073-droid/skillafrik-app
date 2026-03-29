// frontend/frontend-vite/src/pages/Analytics/AnalyticsPage.jsx
import { useEffect, useState } from "react";
import { FaChartLine, FaChartBar, FaChartArea, FaDownload, FaCalendar } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import { useUser } from "../../context/UserContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

export default function AnalyticsPage() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [type, setType] = useState(user?.role === "freelancer" ? "freelancer" : "client");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/analytics/${type}?period=${period}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, period, type]);

  const exportData = async () => {
    try {
      const response = await axiosInstance.get(`/analytics/export?type=${type}&period=${period}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_analytics_${period}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export:", err);
      alert("Failed to export data");
    }
  };

  if (!user) {
    return (
      <PageContainer title="Analytics" subtitle="Please log in to view your analytics">
        <Card>
          <p className="text-center py-8 text-gray-500">
            You need to be logged in to view analytics.
          </p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Analytics Dashboard"
      subtitle="Track your performance and growth on SkillAfrik"
      maxWidth="max-w-6xl"
    >
      {/* Controls */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="freelancer">Freelancer Analytics</option>
              <option value="client">Client Analytics</option>
            </select>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FaDownload />
            Export CSV
          </button>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Loading analytics...</p>
        </div>
      ) : !analytics ? (
        <Card>
          <p className="text-center py-8 text-gray-500">No analytics data available</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Freelancer Analytics */}
          {type === "freelancer" && (
            <>
              {/* Earnings Trends */}
              <Card className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <FaChartLine className="text-green-500" />
                  <h3 className="text-lg font-semibold">Earnings Trends</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.earningsTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                    <Area type="monotone" dataKey="earnings" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Accepted Proposals */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <FaChartBar className="text-blue-500" />
                  <h3 className="text-lg font-semibold">Accepted Proposals</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.acceptedProposals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Skill Demand */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <FaChartArea className="text-purple-500" />
                  <h3 className="text-lg font-semibold">Skill Demand</h3>
                </div>
                <div className="space-y-3">
                  {analytics.skillDemand.slice(0, 5).map((skill, index) => (
                    <div key={skill._id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill._id}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(skill.demand / Math.max(...analytics.skillDemand.map(s => s.demand))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{skill.demand}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Completed Jobs:</strong> {analytics.completedJobs}
                  </p>
                </div>
              </Card>
            </>
          )}

          {/* Client Analytics */}
          {type === "client" && (
            <>
              {/* Project Progress */}
              <Card className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <FaChartBar className="text-orange-500" />
                  <h3 className="text-lg font-semibold">Project Progress</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analytics.projectProgress.map((status) => (
                    <div key={status._id} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{status.count}</div>
                      <div className="text-sm text-gray-500 capitalize">{status._id.replace('_', ' ')}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Budget Tracking */}
              <Card className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <FaChartLine className="text-green-500" />
                  <h3 className="text-lg font-semibold">Budget Tracking</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.budgetTracking}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Line type="monotone" dataKey="totalBudget" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="spent" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Stats Cards */}
              <Card>
                <div className="text-center p-6">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{analytics.hiredFreelancers}</div>
                  <div className="text-gray-500">Freelancers Hired</div>
                </div>
              </Card>

              <Card>
                <div className="text-center p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">{analytics.activeJobs}</div>
                  <div className="text-gray-500">Active Jobs</div>
                </div>
              </Card>
            </>
          )}
        </div>
      )}
    </PageContainer>
  );
}