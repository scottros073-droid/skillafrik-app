// src/pages/Premium/MonetizationUpgrades.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./MonetizationUpgrades.css";

export default function MonetizationUpgrades({ user, onUpgradeSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const purchaseVerificationBadge = async () => {
    try {
      setLoading(true);
      setError("");
      
      // This would call the payment endpoint
      const response = await axiosInstance.post("/payments/verify-badge", {
        purpose: "verification",
        amount: 200, // $2 in cents or in platform currency
      });

      if (response.data.authorizationUrl) {
        // Redirect to payment gateway
        window.location.href = response.data.authorizationUrl;
      }
      
      setSuccess("Verification badge purchased!");
      if (onUpgradeSuccess) onUpgradeSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to purchase badge");
    } finally {
      setLoading(false);
    }
  };

  const purchaseProfileBoost = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.post("/payments/profile-boost", {
        purpose: "profile_boost",
        amount: 300, // $3
        duration: 30, // 30 days
      });

      if (response.data.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      }

      setSuccess("Profile boost activated!");
      if (onUpgradeSuccess) onUpgradeSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to purchase boost");
    } finally {
      setLoading(false);
    }
  };

  const purchaseFeaturedAgent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.post("/payments/featured-listing", {
        purpose: "featured_agent",
        amount: 500, // $5
        duration: 30,
      });

      if (response.data.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      }

      setSuccess("Featured agent status activated!");
      if (onUpgradeSuccess) onUpgradeSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to purchase featured listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="monetization-upgrades">
      <div className="upgrades-header">
        <h1>💰 Upgrade Your Profile</h1>
        <p>Boost visibility and build trust with quick, affordable upgrades</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="upgrades-grid">
        {/* Verification Badge */}
        <div className="upgrade-card verification-badge">
          <div className="badge-icon">✓</div>
          <h2>Verified Badge</h2>
          <div className="price">$2</div>
          <p className="duration">One-time payment</p>

          <ul className="benefits">
            <li>✓ Trust & credibility badge on profile</li>
            <li>✓ Higher ranking in freelancer search</li>
            <li>✓ More client attention</li>
            <li>✓ Builds long-term reputation</li>
          </ul>

          <p className="description">
            Get the verified badge to build trust with clients and stand out from the competition.
          </p>

          {userData?.premiumFeatures?.verifiedBadge ? (
            <button className="btn btn-secondary btn-large" disabled>
              ✓ Already Verified
            </button>
          ) : (
            <button
              onClick={purchaseVerificationBadge}
              disabled={loading}
              className="btn btn-primary btn-large"
            >
              {loading ? "Processing..." : "Get Verified Badge"}
            </button>
          )}
        </div>

        {/* Profile Visibility Boost */}
        <div className="upgrade-card profile-boost">
          <div className="badge-icon">📈</div>
          <h2>Profile Boost</h2>
          <div className="price">$3</div>
          <p className="duration">30 days</p>

          <ul className="benefits">
            <li>✓ Featured in search results</li>
            <li>✓ Higher profile visibility</li>
            <li>✓ More job opportunities</li>
            <li>✓ Premium profile highlights</li>
          </ul>

          <p className="description">
            Increase your visibility for 30 days and get more job opportunities from clients seeking top talent.
          </p>

          <button
            onClick={purchaseProfileBoost}
            disabled={loading}
            className="btn btn-success btn-large"
          >
            {loading ? "Processing..." : "Boost Profile (30 days)"}
          </button>
        </div>

        {/* Featured Agent Listing */}
        {userData?.isAgent && (
          <div className="upgrade-card featured-agent">
            <div className="badge-icon">⭐</div>
            <h2>Featured Agent</h2>
            <div className="price">$5</div>
            <p className="duration">30 days</p>

            <ul className="benefits">
              <li>✓ Premium agent listing</li>
              <li>✓ Featured on agent marketplace</li>
              <li>✓ Logo & branding showcase</li>
              <li>✓ Priority job distribution</li>
            </ul>

            <p className="description">
              Get featured as a top agent and attract more freelancers to your jobs.
            </p>

            <button
              onClick={purchaseFeaturedAgent}
              disabled={loading}
              className="btn btn-primary btn-large"
            >
              {loading ? "Processing..." : "Become Featured Agent"}
            </button>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>

        <div className="faq-item">
          <h4>What is the Verified Badge?</h4>
          <p>
            The Verified Badge shows that you've completed your verification with us.
            It builds trust with clients and gives you a competitive advantage.
          </p>
        </div>

        <div className="faq-item">
          <h4>How long does Profile Boost last?</h4>
          <p>
            Profile Boost works for 30 days from the date of purchase.
            Your profile will be featured higher in search results during this period.
          </p>
        </div>

        <div className="faq-item">
          <h4>Can I combine upgrades?</h4>
          <p>
            Yes! You can have both the Verified Badge (permanent) and Profile Boost (30 days)
            active at the same time for maximum visibility.
          </p>
        </div>

        <div className="faq-item">
          <h4>What payment methods do you accept?</h4>
          <p>
            We accept Paystack, credit/debit cards, and mobile money payments.
            All transactions are secure and encrypted.
          </p>
        </div>

        <div className="faq-item">
          <h4>Is there a refund policy?</h4>
          <p>
            Instant upgrades like the Verified Badge can be refunded within 24 hours
            if you're not satisfied. Time-based upgrades have pro-rata refunds.
          </p>
        </div>
      </div>
    </div>
  );
}
