import api from "../api";

export const markChatAsRead = async (chatId) => {
  const res = await api.put(`/messages/${chatId}/read`, {}); // sends token via interceptor
  return res.data;
};

// reuse sendMessage if needed
export const sendMessageREST = async (payload) => {
  const res = await api.post('/messages', payload);
  return res.data;
};
