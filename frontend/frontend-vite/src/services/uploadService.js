import axiosInstance from "../utils/axiosInstance";

export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const res = await axiosInstance.post("/upload/file", form, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data;
}
