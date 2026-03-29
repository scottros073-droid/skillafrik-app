import axios from "../utils/axiosInstance";

const upgrade = (plan) => {
  if (plan === "free") {
    return Promise.resolve({ data: { message: "Already on free plan" } });
  }
  return axios.post("/premium/upgrade", { plan });
};

export default { upgrade };
