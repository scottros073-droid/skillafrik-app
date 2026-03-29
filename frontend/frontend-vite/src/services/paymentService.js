// src/services/paymentService.js
import axiosInstance from "../utils/axios";

/* ===============================
   WALLET
================================ */

// Fetch user's wallet
export const getWallet = async () => {
  const { data } = await axiosInstance.get("/wallet");
  return data;
};

// Fetch wallet transactions
export const getTransactions = async () => {
  const { data } = await axiosInstance.get("/wallet/transactions");
  return data;
};

/* ===============================
   PAYMENTS
================================ */

// Initialize payment
export const initPayment = async (paymentData) => {
  const { data } = await axiosInstance.post("/payments/init", paymentData);
  return data; // usually includes reference & authorization URL
};

// Verify payment
export const verifyPayment = async (reference) => {
  const { data } = await axiosInstance.get(`/payments/verify/${reference}`);
  return data; // returns payment status
};

/* ===============================
   COMBINED HELPER
================================ */

// Frontend-friendly function to process a payment
// 1️⃣ Initiates the payment
// 2️⃣ Verifies it after completion
export const processPayment = async (paymentData) => {
  const init = await initPayment(paymentData);
  // You might redirect the user to init.authorization_url here in frontend
  return init;
};
