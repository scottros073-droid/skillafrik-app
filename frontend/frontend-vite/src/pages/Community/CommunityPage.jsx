import { useEffect, useState } from "react";
import { FaPaperPlane, FaUserCircle, FaHeart, FaComment, FaShare, FaThumbsUp, FaThumbsDown, FaReply, FaTrophy } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import { useUser } from "../../context/UserContext";

export default function CommunityPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReply, setShowReply] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/community");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submitPost = async () => {
    if (!content.trim() || !title.trim() || !user) return;

    setSubmitting(true);
    try {
      await axiosInstance.post("/community", {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      });
      setTitle("");
      setContent("");
      setTags("");
      fetchPosts();
    } catch (err) {
      console.error("Failed to post:", err);
      alert("Failed to post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const voteOnPost = async (postId, voteType, replyId = null) => {
    try {
      await axiosInstance.post("/community/vote", {
        postId,
        voteType,
        replyId
      });
      fetchPosts();
    } catch (err) {
      console.error("Failed to vote:", err);
      alert("Failed to vote. Please try again.");
    }
  };

  const submitReply = async (postId) => {
    if (!replyContent.trim()) return;

    try {
      await axiosInstance.post(`/community/${postId}/reply`, {
        content: replyContent.trim()
      });
      setReplyContent("");
      setShowReply(null);
      fetchPosts();
    } catch (err) {
      console.error("Failed to reply:", err);
      alert("Failed to reply. Please try again.");
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

  return (
    <PageContainer
      title="Community Hub"
      subtitle="Connect, share tips, and grow with fellow freelancers and clients"
      maxWidth="max-w-4xl"
    >
      {/* Create Post */}
      {user && (
        <Card className="mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold shrink-0">
              {user.firstName?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full p-3 mb-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, tips, or questions..."
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated): tips, freelance, design..."
                className="w-full p-3 mt-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {content.length}/1000 characters
                </p>
                <button
                  onClick={submitPost}
                  disabled={!content.trim() || !title.trim() || submitting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaPaperPlane />
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {!user && (
        <Card className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
          <p className="text-center text-gray-600 dark:text-gray-400 py-4">
            <a href="/login" className="text-indigo-600 hover:underline font-medium">
              Sign in
            </a>{" "}
            to join the conversation
          </p>
        </Card>
      )}

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FaUserCircle className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share!</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post._id} hover>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold shrink-0">
                  {post.user?.firstName?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {post.title}
                      </h3>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        {post.user?.firstName} {post.user?.lastName || ""}
                        {post.user?.badges?.includes("Top Contributor") && (
                          <FaTrophy className="inline ml-1 text-yellow-500" title="Top Contributor" />
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(post.createdAt)}
                        {post.tags?.length > 0 && (
                          <span className="ml-2">
                            {post.tags.map(tag => `#${tag}`).join(" ")}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words mb-4">
                    {post.content}
                  </p>

                  {/* Replies */}
                  {post.replies?.length > 0 && (
                    <div className="space-y-3 mb-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                      {post.replies.map((reply) => (
                        <div key={reply._id} className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 shrink-0">
                            {reply.user?.firstName?.charAt(0) || "U"}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {reply.user?.firstName} {reply.user?.lastName || ""}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {reply.content}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => voteOnPost(post._id, 'up', reply._id)}
                                className="text-xs text-gray-500 hover:text-green-500"
                              >
                                <FaThumbsUp className="inline mr-1" />
                                {reply.upvotes || 0}
                              </button>
                              <button
                                onClick={() => voteOnPost(post._id, 'down', reply._id)}
                                className="text-xs text-gray-500 hover:text-red-500"
                              >
                                <FaThumbsDown className="inline mr-1" />
                                {reply.downvotes || 0}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {showReply === post._id && (
                    <div className="mb-4 pl-4 border-l-2 border-indigo-200 dark:border-indigo-700">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        rows={2}
                        className="w-full p-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => submitReply(post._id)}
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => setShowReply(null)}
                          className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => voteOnPost(post._id, 'up')}
                      className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-green-500 transition text-sm"
                    >
                      <FaThumbsUp />
                      <span>{post.upvotes || 0}</span>
                    </button>
                    <button
                      onClick={() => voteOnPost(post._id, 'down')}
                      className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-red-500 transition text-sm"
                    >
                      <FaThumbsDown />
                      <span>{post.downvotes || 0}</span>
                    </button>
                    <button
                      onClick={() => setShowReply(post._id)}
                      className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition text-sm"
                    >
                      <FaReply />
                      <span>Reply</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition text-sm">
                      <FaShare />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
