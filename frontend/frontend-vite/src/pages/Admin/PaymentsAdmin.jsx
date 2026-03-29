import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

export default function PaymentsAdmin() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    const res = await axiosInstance.get('/admin/payments');
    setPayments(res.data);
  };

  useEffect(() => { fetchPayments(); }, []);

  const markRefund = async (id) => {
    await axiosInstance.post(`/admin/payments/${id}/refund`);
    fetchPayments();
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Payments</h3>
      {payments.map(p => (
        <div key={p._id} style={{ border: '1px solid #ccc', padding: 10, margin: '8px 0' }}>
          <div>_id: {p._id}</div>
          <div>user: {p.userId}</div>
          <div>amount: {p.amount}</div>
          <div>purpose: {p.purpose}</div>
          <div>status: {p.status}</div>
          <button onClick={() => markRefund(p._id)}>Refund</button>
        </div>
      ))}
    </div>
  );
}
