/**
 * apiService.js - Centralized API client for SkillAfrik backend
 * 
 * Handles all HTTP requests with:
 * - Automatic auth token management
 * - Error handling and logging
 * - Request/response interceptors
 * - Timeout management
 * - Type-safe responses
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TIMEOUT = 30000; // 30 seconds

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  try {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const parsed = JSON.parse(auth);
      return parsed.token || parsed.accessToken || null;
    }
  } catch (e) {
    console.warn("Failed to parse auth token:", e);
  }
  return null;
};

/**
 * Main API request function
 */
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body = null,
    headers = {},
    timeout = TIMEOUT,
    skipAuth = false,
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const token = !skipAuth ? getAuthToken() : null;

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
      credentials: "include", // Send cookies
    });

    clearTimeout(timeoutId);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
     throw new Error("Session expired. Please login again.");
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.message || data?.error || `HTTP ${response.status}`;
      throw {
        status: response.status,
        message: errorMessage,
        data,
      };
    }

    return {
      success: true,
      data: data?.data || data,
      status: response.status,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.error("Request timeout:", url);
      return {
        success: false,
        error: "Request timeout",
        status: 408,
      };
    }

    if (error instanceof Error) {
      console.error("API Error:", {
        endpoint,
        message: error.message,
        status: error.status,
      });
    } else {
      console.error("API Error:", error);
    }

    return {
      success: false,
      error: error?.message || "An error occurred",
      status: error?.status || 500,
      data: error?.data || null,
    };
  }
};

/**
 * ============================================
 * AUTH ENDPOINTS
 * ============================================
 */
export const authAPI = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
      skipAuth: true,
    }),

  register: (data) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: data,
      skipAuth: true,
    }),

  logout: () => apiRequest("/auth/logout", { method: "POST" }),

  getCurrentUser: () => apiRequest("/auth/me"),

  updateProfile: (data) =>
    apiRequest("/auth/profile", {
      method: "PUT",
      body: data,
    }),
};

/**
 * ============================================
 * DASHBOARD ENDPOINTS
 * ============================================
 */
export const dashboardAPI = {
  getDashboard: () => apiRequest("/dashboard"),

  getStats: () => apiRequest("/dashboard/stats"),

  getRecentActivity: (limit = 10) =>
    apiRequest(`/dashboard/activity?limit=${limit}`),

  getEarnings: (period = "month") =>
    apiRequest(`/dashboard/earnings?period=${period}`),

  getJobs: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`/dashboard/jobs?${query}`);
  },
};

/**
 * ============================================
 * FREELANCER PROFILE ENDPOINTS
 * ============================================
 */
export const freelancerAPI = {
  getProfile: (userId) => apiRequest(`/freelancers/freelancer/${userId}`),

  updateProfile: (data) =>
    apiRequest("/freelancers/freelancer", {
      method: "POST",
      body: data,
    }),

  getPublicProfile: (userId) =>
    apiRequest(`/public-profile/${userId}`, { skipAuth: true }),

  getFreelancersList: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`/freelancers/freelancers?${query}`, { skipAuth: true });
  },

  searchFreelancers: (q, filters = {}) => {
    const params = new URLSearchParams({ q, ...filters }).toString();
    return apiRequest(`/freelancer-search?${params}`, { skipAuth: true });
  },

  getSkills: () => apiRequest("/freelancers/skills", { skipAuth: true }),
};

/**
 * ============================================
 * PORTFOLIO ENDPOINTS
 * ============================================
 */
export const portfolioAPI = {
  getPortfolio: (userId) => apiRequest(`/portfolio/${userId}`),

  createPortfolio: (data) =>
    apiRequest("/portfolio", {
      method: "POST",
      body: data,
    }),

  updatePortfolio: (id, data) =>
    apiRequest(`/portfolio/${id}`, {
      method: "PUT",
      body: data,
    }),

  deletePortfolio: (id) =>
    apiRequest(`/portfolio/${id}`, {
      method: "DELETE",
    }),

  getProjects: (userId, limit = 10) =>
    apiRequest(`/portfolio/${userId}?limit=${limit}`),
};

/**
 * ============================================
 * REVIEW & RATING ENDPOINTS
 * ============================================
 */
export const reviewAPI = {
  getReviews: (userId) => apiRequest(`/reviews/${userId}`),

  createReview: (data) =>
    apiRequest("/reviews", {
      method: "POST",
      body: data,
    }),

  getRating: (userId) => apiRequest(`/reviews/${userId}/rating`),

  getAverageRating: (userId) =>
    apiRequest(`/reviews/${userId}/average`),
};

/**
 * ============================================
 * JOB ENDPOINTS
 * ============================================
 */
export const jobAPI = {
  getJobs: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`/jobs?${query}`);
  },

  getJob: (id) => apiRequest(`/jobs/${id}`),

  createJob: (data) =>
    apiRequest("/jobs", {
      method: "POST",
      body: data,
    }),

  updateJob: (id, data) =>
    apiRequest(`/jobs/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteJob: (id) =>
    apiRequest(`/jobs/${id}`, {
      method: "DELETE",
    }),

  searchJobs: (q, filters = {}) => {
    const params = new URLSearchParams({ q, ...filters }).toString();
    return apiRequest(`/jobs/search?${params}`);
  },
};

/**
 * ============================================
 * MESSAGE/CHAT ENDPOINTS
 * ============================================
 */
export const messageAPI = {
  getMessages: (conversationId) =>
    apiRequest(`/messages/${conversationId}`),

  sendMessage: (data) =>
    apiRequest("/messages", {
      method: "POST",
      body: data,
    }),

  getConversations: () => apiRequest("/messages/conversations"),

  markAsRead: (conversationId) =>
    apiRequest(`/messages/${conversationId}/read`, {
      method: "PUT",
    }),
};

/**
 * ============================================
 * WALLET ENDPOINTS
 * ============================================
 */
export const walletAPI = {
  getBalance: () => apiRequest("/wallet/balance"),

  getTransactions: (limit = 20) =>
    apiRequest(`/wallet/transactions?limit=${limit}`),

  withdrawFunds: (data) =>
    apiRequest("/wallet/withdraw", {
      method: "POST",
      body: data,
    }),

  fundWallet: (data) =>
    apiRequest("/wallet/fund", {
      method: "POST",
      body: data,
    }),
};

/**
 * ============================================
 * HIRE/ENGAGEMENT ENDPOINTS
 * ============================================
 */
export const hireAPI = {
  sendProposal: (data) =>
    apiRequest("/hire/proposal", {
      method: "POST",
      body: data,
    }),

  acceptProposal: (id) =>
    apiRequest(`/hire/proposal/${id}/accept`, {
      method: "PUT",
    }),

  rejectProposal: (id) =>
    apiRequest(`/hire/proposal/${id}/reject`, {
      method: "PUT",
    }),

  getProposals: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`/hire/proposals?${query}`);
  },

  sendMessage: (freelancerId, message) =>
    apiRequest("/hire/message", {
      method: "POST",
      body: { freelancerId, message },
    }),
};

/**
 * ============================================
 * PAYMENT ENDPOINTS
 * ============================================
 */
export const paymentAPI = {
  getPaymentHistory: (limit = 20) =>
    apiRequest(`/payments/history?limit=${limit}`),

  initiatePayment: (data) =>
    apiRequest("/payments/initiate", {
      method: "POST",
      body: data,
    }),

  verifyPayment: (reference) =>
    apiRequest(`/payments/verify/${reference}`),

  getInvoice: (id) => apiRequest(`/payments/invoice/${id}`),
};

/**
 * ============================================
 * UTILITY FUNCTIONS
 * ============================================
 */

/**
 * Handle API response with error display
 */
export const handleApiResponse = (response, options = {}) => {
  const { showError = true, onError = null } = options;

  if (!response.success) {
    const error = response.error || "An error occurred";
    if (showError) {
      console.error("API Error:", error);
      if (onError) onError(error);
    }
    return null;
  }

  return response.data;
};

/**
 * Format error message for display
 */
export const formatApiError = (response) => {
  if (typeof response?.error === "string") {
    return response.error;
  }
  if (typeof response?.data?.message === "string") {
    return response.data.message;
  }
  return "An error occurred. Please try again.";
};

/**
 * Batch API requests
 */
export const batchApiRequests = async (requests) => {
  return Promise.all(requests);
};

/**
 * Cached API request (in-memory cache)
 */
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cachedApiRequest = async (endpoint, options = {}) => {
  const cacheKey = `${endpoint}:${JSON.stringify(options)}`;

  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return { success: true, data, cached: true };
    }
    cache.delete(cacheKey);
  }

  const response = await apiRequest(endpoint, options);

  if (response.success) {
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });
  }

  return response;
};

/**
 * Clear cache
 */
export const clearApiCache = () => cache.clear();

export default {
  apiRequest,
  authAPI,
  dashboardAPI,
  freelancerAPI,
  portfolioAPI,
  reviewAPI,
  jobAPI,
  messageAPI,
  walletAPI,
  hireAPI,
  paymentAPI,
  handleApiResponse,
  formatApiError,
  batchApiRequests,
  cachedApiRequest,
  clearApiCache,
};
