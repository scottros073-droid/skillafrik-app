import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";

export default function AdsAdminPage() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/ads").then((res) => setAds(res.data));
  }, []);

  const approve = (id) =>
    axios.put(`/api/admin/ads/${id}/approve`).then(() => location.reload());

  return (
    <div>
      <h2 className="text-xl font-bold">Ads Approval</h2>
      {ads.map((ad) => (
        <div key={ad._id} className="border p-3 my-2">
          <p>{ad.title}</p>
          <p>Status: {ad.status}</p>
          <button onClick={() => approve(ad._id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}
