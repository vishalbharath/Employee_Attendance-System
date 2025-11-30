import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../slices/authSlice";

const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

export default function ProtectedRoute({ children, roles }) {
  const { user, loginTime } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !loginTime) return;

    const now = Date.now();
    if (now - loginTime > SESSION_DURATION_MS) {
      dispatch(logout());
    }
  }, [user, loginTime, dispatch]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
