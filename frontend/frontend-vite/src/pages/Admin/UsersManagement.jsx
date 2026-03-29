import React, { useEffect, useState } from "react";
import axios from "../../services/api";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/auth/users"); // backend route for all users
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-management">
      <h2>Users Management</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.firstName} {user.lastName} - {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersManagement;
