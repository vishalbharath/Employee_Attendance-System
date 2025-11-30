import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import EmployeeDashboardPage from "./pages/EmployeeDashboardPage.jsx";
import MarkAttendancePage from "./pages/MarkAttendancePage.jsx";
import AttendanceHistoryPage from "./pages/AttendanceHistoryPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ManagerDashboardPage from "./pages/ManagerDashboardPage.jsx";
import AllAttendancePage from "./pages/AllAttendancePage.jsx";
import TeamCalendarPage from "./pages/TeamCalendarPage.jsx";

import ReportsPage from "./pages/ReportsPage.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<div>Welcome to Employee Attendance System</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Employee routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute roles={["employee"]}>
                <EmployeeDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/mark"
            element={
              <ProtectedRoute roles={["employee"]}>
                <MarkAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/history"
            element={
              <ProtectedRoute roles={["employee"]}>
                <AttendanceHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute roles={["employee"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Manager routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute roles={["manager"]}>
                <ManagerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/calendar"
            element={
              <ProtectedRoute roles={['manager']}>
                <TeamCalendarPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/all"
            element={
              <ProtectedRoute roles={["manager"]}>
                <AllAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/calendar"
            element={
              <ProtectedRoute roles={["manager"]}>
                <TeamCalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/reports"
            element={
              <ProtectedRoute roles={["manager"]}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
