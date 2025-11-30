import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav>
      <span className="brand">Employee Attendance</span>

      {!user && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {user && user.role === "employee" && (
        <>
          <Link to="/employee/dashboard">Dashboard</Link>
          <Link to="/employee/mark">Mark Attendance</Link>
          <Link to="/employee/history">History</Link>
          <Link to="/employee/profile">Profile</Link>
        </>
      )}

      {user && user.role === "manager" && (
        <>
          <Link to="/manager/dashboard">Dashboard</Link>
          <Link to="/manager/all">All Attendance</Link>
          <Link to="/manager/reports">Reports</Link>
          <Link to="/manager/calendar">Team Calendar</Link>

        </>
      )}

      {user && (
        <button onClick={handleLogout}>
          Logout {user.role === "manager" ? "(Manager)" : ""}
        </button>
      )}
    </nav>
  );
}
