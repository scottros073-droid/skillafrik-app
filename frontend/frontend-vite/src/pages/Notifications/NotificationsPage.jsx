// frontend/frontend-vite/src/pages/Notifications/NotificationsPage.jsx
import { useEffect, useState } from "react";
import { FaBell, FaCheck, FaCheckDouble, FaExclamationTriangle, FaInfoCircle, FaRocket, FaUser, FaBriefcase, FaClock, FaStar } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import { useUser } from "../../context/UserContext";
import { useSocket } from "../../context/SocketContext.jsx";

export default function NotificationsPage() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const fetchNotifications = async (loadMore = false) => {
    if (!user) return;

    try {
      const res = await axiosInstance.get(`/notifications?page=${loadMore ? page : 1}&limit=20&unreadOnly=${unreadOnly}`);
      if (loadMore) {
        setNotifications(prev => [...prev, ...res.data.notifications]);
      } else {
        setNotifications(res.data.notifications);
      }
      setHasMore(res.data.notifications.length === 20);
      setPage(loadMore ? page + 1 : 2);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const socket = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, [user, unreadOnly]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification:new", handleNewNotification);
    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(notif => notif._id === id ? { ...notif, isRead: true } : notif)
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/notifications/read-all");
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const generateSmartNotifications = async () => {
    try {
      await axiosInstance.post("/notifications/generate-smart");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to generate smart notifications:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "job_recommendation":
        return <FaBriefcase className="text-blue-500" />;
      case "freelancer_suggestion":
        return <FaUser className="text-green-500" />;
      case "proposal_expiring":
        return <FaClock className="text-orange-500" />;
      case "project_reminder":
        return <FaExclamationTriangle className="text-red-500" />;
      case "hire_nudge":
        return <FaRocket className="text-purple-500" />;
      case "follow_up_proposal":
        return <FaInfoCircle className="text-indigo-500" />;
      case "upgrade_suggestion":
        return <FaStar className="text-yellow-500" />;
      case "review_reminder":
        return <FaStar className="text-pink-500" />;
      case "payment_received":
        return <FaCheck className="text-green-500" />;
      case "job_completed":
        return <FaCheckDouble className="text-blue-500" />;
      case "new_message":
        return <FaBell className="text-gray-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <PageContainer title="Notifications" subtitle="Please log in to view your notifications">
        <Card>
          <p className="text-center py-8 text-gray-500">
            You need to be logged in to view notifications.
          </p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Notifications"
      subtitle="Stay updated with personalized recommendations and important updates"
      maxWidth="max-w-4xl"
    >
      {/* Controls */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={`px-4 py-2 rounded-lg border ${
                unreadOnly
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              }`}
            >
              {unreadOnly ? "Show All" : "Unread Only"}
            </button>
            <button
              onClick={generateSmartNotifications}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Generate Smart Notifications
            </button>
          </div>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Mark All as Read
          </button>
        </div>
      </Card>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FaBell className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {unreadOnly ? "No unread notifications" : "No notifications yet"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification._id}
              className={`transition-all ${
                !notification.isRead
                  ? "border-l-4 border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/10"
                  : ""
              }`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="flex-shrink-0 p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 rounded-lg transition"
                        title="Mark as read"
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                  {/* Action buttons based on notification type */}
                  {notification.type === "job_recommendation" && notification.data?.jobId && (
                    <div className="mt-3">
                      <a
                        href={`/jobs/${notification.data.jobId}`}
                        className="inline-flex items-center px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                      >
                        View Job
                      </a>
                    </div>
                  )}
                  {notification.type === "freelancer_suggestion" && notification.data?.jobId && (
                    <div className="mt-3">
                      <a
                        href={`/jobs/${notification.data.jobId}`}
                        className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        View Job
                      </a>
                    </div>
                  )}
                  {notification.type === "upgrade_suggestion" && (
                    <div className="mt-3">
                      <a
                        href="/upgrade"
                        className="inline-flex items-center px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                      >
                        Upgrade Now
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {hasMore && (
            <div className="text-center py-4">
              <button
                onClick={() => fetchNotifications(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}