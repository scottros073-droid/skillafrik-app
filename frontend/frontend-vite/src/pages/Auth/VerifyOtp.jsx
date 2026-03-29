import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      // No user found, redirect to signup
      navigate("/signup");
      return;
    }

    setUserId(user._id || user.id);

    // If already verified, redirect to dashboard
    if (user.isVerified) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User not found");

    setLoading(true);

    try {
      await axiosInstance.post("/auth/verify-otp", { userId, code: otp });

      // Update user in localStorage as verified
      const updatedUser = { ...JSON.parse(localStorage.getItem("user")), isVerified: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Account verified successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Account</h2>

      <form onSubmit={submit} className="space-y-3">
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
