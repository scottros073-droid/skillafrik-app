import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import ReviewList from "../../components/ReviewList";
import ReviewForm from "../../components/ReviewForm";
import PageContainer from "../../components/ui/PageContainer";
import { useUser } from "../../context/UserContext";

export default function ReviewsPage() {
  const { userId } = useParams();
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const targetUserId = userId || user?._id;

  useEffect(() => {
    const fetchReviews = async () => {
      if (!targetUserId) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/reviews/user/${targetUserId}`);
        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [targetUserId]);

  const handleReviewSuccess = () => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/reviews/user/${targetUserId}`);
        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  };

  const isOwnProfile = !userId || userId === user?._id;

  return (
    <PageContainer
      title={isOwnProfile ? "Your Reviews" : "Reviews"}
      subtitle={isOwnProfile ? "See what clients say about your work" : "Reviews for this freelancer"}
      maxWidth="max-w-4xl"
    >
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
        </div>
      ) : (
        <>
          <ReviewList reviews={reviews} showHeader={true} />
          {!isOwnProfile && user && (
            <div className="mt-8">
              <ReviewForm workerId={targetUserId} onSuccess={handleReviewSuccess} />
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
