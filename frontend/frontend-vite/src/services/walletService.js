import api from "../api";
export const getWallet = async () => (await api.get("/wallets/me")).data;
export const walletTransactions = async () => (await api.get("/wallets/transactions")).data;
