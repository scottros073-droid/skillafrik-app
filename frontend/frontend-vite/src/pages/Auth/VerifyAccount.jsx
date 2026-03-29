import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";
import axios from "../../services/api";

const VerifyAccount = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`/auth/verify/${token}`);
        setStatus("success");
        setMessage("Account verified successfully! You can now log in.");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed or token expired. Try signing up again.");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-8 py-12 text-center">
          {status === "verifying" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                <FaSpinner className="text-indigo-600 dark:text-indigo-400 text-2xl animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifying account</h1>
              <p className="text-gray-600 dark:text-gray-400">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <FaCheckCircle className="text-emerald-600 dark:text-emerald-400 text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verified!</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Go to login
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <FaExclamationCircle className="text-red-600 dark:text-red-400 text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification failed</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <Link
                to="/signup"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Try signing up again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
