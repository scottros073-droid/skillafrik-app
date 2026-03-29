import React, { useEffect, useState } from "react";

function UserBadge({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`);
      const data = await res.json();
      setUser(data);
    }
    fetchUser();
  }, [userId]);

  if (!user) return null;

  return (
    <div>
      <h2>{user.firstName} {user.lastName}</h2>
      {user.verified ? <span className="badge">Verified ✅</span> : <span className="badge">Not Verified ❌</span>}
    </div>
  );
}

export default UserBadge;
import UserBadge from "./components/UserBadge";

<UserBadge userId={currentUser.id} />
