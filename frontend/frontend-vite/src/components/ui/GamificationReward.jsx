// frontend/frontend-vite/src/components/ui/GamificationReward.jsx
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { FaTrophy, FaStar, FaFire, FaRocket, FaGift } from "react-icons/fa";

export default function GamificationReward({ reward, onComplete }) {
  const [visible, setVisible] = useState(true);
  const [animationStage, setAnimationStage] = useState(0);

  // 🔊 Play reward sound (production-safe with /public URL path)
  const playSound = async () => {
    const soundUrl = "http://localhost:5000/public/sound.mp3";
    try {
      const check = await fetch(soundUrl, { method: "HEAD", cache: "no-store" });
      const audio = new Audio(check.ok ? soundUrl : "http://localhost:5000/public/default.mp3");
      audio.volume = 0.5;
      await audio.play();
    } catch (err) {
      console.warn("Audio playback failed", err);
    }
  };

  // 🎉 Trigger confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    playSound();
    triggerConfetti();

    const t1 = setTimeout(() => setAnimationStage(1), 300);
    const t2 = setTimeout(() => setAnimationStage(2), 1200);
    const t3 = setTimeout(() => setAnimationStage(3), 2200);
    const t4 = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (!visible || !reward) return null;

  // 🎯 Reward icon
  const getRewardIcon = () => {
    switch (reward.type) {
      case "level_up": {
        return <FaRocket className="text-purple-500" />;
      }
      case "badge_earned": {
        return <FaTrophy className="text-yellow-500" />;
      }
      case "xp_gained": {
        return <FaStar className="text-blue-500" />;
      }
      case "streak_bonus": {
        return <FaFire className="text-orange-500" />;
      }
      case "streak": {
        return <FaFire className="text-red-500" />;
      }
      default: {
        return <FaGift className="text-green-500" />;
      }
    }
  };

  // 🎨 Gradient color
  const getRewardColor = () => {
    switch (reward.type) {
      case "level_up": {
        return "from-purple-500 to-pink-500";
      }
      case "badge_earned": {
        return "from-yellow-500 to-orange-500";
      }
      case "xp_gained": {
        return "from-blue-500 to-cyan-500";
      }
      case "streak_bonus": {
        return "from-orange-500 to-red-500";
      }
      case "streak": {
        return "from-red-500 to-pink-600";
      }
      default: {
        return "from-green-500 to-emerald-500";
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Reward Card */}
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl transform transition-all duration-500 ${
          animationStage >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {/* Gradient Glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${getRewardColor()} opacity-20 rounded-2xl animate-pulse`}
        />

        {/* Floating XP Particles */}
        {animationStage >= 2 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="absolute text-yellow-400 text-sm animate-float"
                style={{
                  left: `${Math.random() * 80}%`,
                  top: `${Math.random() * 80}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                +XP
              </span>
            ))}
          </div>
        )}

        <div className="relative z-10 text-center">
          {/* Icon */}
          <div
            className={`inline-block text-6xl mb-4 transform transition-transform duration-500 ${
              animationStage >= 1 ? "animate-bounce" : ""
            }`}
          >
            {getRewardIcon()}
          </div>

          {/* Title */}
          <h2
            className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-500 ${
              animationStage >= 1 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {reward.title || "Achievement Unlocked!"}
          </h2>

          {/* Message */}
          <p
            className={`text-gray-600 dark:text-gray-300 transition-all duration-500 delay-200 ${
              animationStage >= 1 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {reward.message || "You're making great progress!"}
          </p>

          {/* XP Info */}
          {reward.xp && (
            <div
              className={`mt-4 p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg transition-all duration-500 delay-400 ${
                animationStage >= 2 ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
              }`}
            >
              <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                +{reward.xp} XP Earned!
              </p>
              {reward.level && <p className="text-sm text-gray-500 mt-1">Level {reward.level} Reached!</p>}
            </div>
          )}

          {/* Badge Info */}
          {reward.badge && (
            <div
              className={`mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg transition-all duration-500 delay-400 ${
                animationStage >= 2 ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
              }`}
            >
              <p className="text-yellow-600 dark:text-yellow-400 font-semibold">🏆 {reward.badge} Badge Earned!</p>
            </div>
          )}

          {/* Progress Bar */}
          {reward.progress && (
            <div
              className={`mt-4 transition-all duration-500 delay-600 ${
                animationStage >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${reward.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Progress to next level</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setVisible(false);
            if (onComplete) onComplete();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white pointer-events-auto"
        >
          ✕
        </button>
      </div>

      {/* Float Animation */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-80px); opacity: 0; }
          }
          .animate-float {
            animation: float 2s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}