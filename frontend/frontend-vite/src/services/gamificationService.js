// frontend/frontend-vite/src/services/gamificationService.js
import axiosInstance from "../utils/axiosInstance";

export const recordActivity = async (type, showReward = true) => {
  try {
    const response = await axiosInstance.post("/gamification/activity", { type });
    const { xpGained, streakBonus, totalXP, levelUp, newLevel, badgeEarned, currentStreak, skillXP, skillLevel } = response.data;

    if (showReward && (badgeEarned || xpGained > 0 || streakBonus > 0)) {
      // Trigger reward animation
      const rewardData = {
        title: badgeEarned ? "Achievement Unlocked!" : streakBonus > 0 ? "Streak Bonus!" : "XP Gained!",
        message: badgeEarned
          ? `You've earned the ${badgeEarned} badge!`
          : streakBonus > 0
          ? `Streak bonus: +${streakBonus} XP! Current streak: ${currentStreak} days`
          : `Earned ${xpGained} XP for your activity!`,
        xp: xpGained + streakBonus,
        level: newLevel,
        badge: badgeEarned,
        streakBonus: streakBonus,
        currentStreak: currentStreak,
        skillXP: skillXP,
        skillLevel: skillLevel,
        type: badgeEarned ? "badge_earned" : streakBonus > 0 ? "streak_bonus" : "xp_gained"
      };

      // Dispatch custom event for reward animation
      window.dispatchEvent(new CustomEvent('gamificationReward', { detail: rewardData }));
    }

    return { xp, level, badges, reputation };
  } catch (error) {
    console.error("Failed to record gamification activity:", error);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await axiosInstance.get("/gamification/leaderboard");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    throw error;
  }
};

export const getWeeklyLeaderboard = async () => {
  try {
    const response = await axiosInstance.get("/gamification/leaderboard/weekly");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch weekly leaderboard:", error);
    throw error;
  }
};

export const getSkillMastery = async (userId = null) => {
  try {
    const url = userId ? `/gamification/skills/${userId}` : "/gamification/skills";
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch skill mastery:", error);
    throw error;
  }
};

export const getStreakInfo = async (userId = null) => {
  try {
    const url = userId ? `/gamification/streak/${userId}` : "/gamification/streak";
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch streak info:", error);
    throw error;
  }
};