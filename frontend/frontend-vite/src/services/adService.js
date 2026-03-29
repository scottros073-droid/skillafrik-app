import axios from "../utils/axiosInstance";

export const fetchAds = () => axios.get("/api/ads");

export const createAd = (data) => axios.post("/api/ads", data);

export const trackView = (id) => axios.post(`/api/ads/${id}/view`);

export const trackClick = (id) => axios.post(`/api/ads/${id}/click`);
