import React from "react";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return null;

  return (
    <div className="card">
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Employee ID: {user.employeeId}</p>
      <p>Department: {user.department}</p>
    </div>
  );
};

export default ProfilePage;
