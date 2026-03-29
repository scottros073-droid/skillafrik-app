// frontend/frontend-vite/src/utils/mediaUtils.js
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || window.location.origin;

export const MEDIA_BASE = apiUrl;

export const getMediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("data:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${MEDIA_BASE}${path}`;
  return `${MEDIA_BASE}/${path}`;
};

export const isValidMediaUrl = (url) => {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url, MEDIA_BASE);
    return !!parsed.pathname && (parsed.pathname.includes(".png") || parsed.pathname.includes(".jpg") || parsed.pathname.includes(".jpeg") || parsed.pathname.includes(".webp") || parsed.pathname.includes(".gif") || parsed.pathname.includes(".mp3") || parsed.pathname.includes(".wav") || parsed.pathname.includes(".ogg"));
  } catch (err) {
    return false;
  }
};

export const checkUrlExists = async (url) => {
  if (!isValidMediaUrl(url)) return false;
  try {
    const heads = await fetch(url, { method: "HEAD", cache: "no-store" });
    return heads.ok;
  } catch (err) {
    return false;
  }
};
