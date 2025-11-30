import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchManagerDashboard } from "../slices/attendanceSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ManagerDashboardPage = () => {
  const dispatch = useDispatch();
  const { managerDashboard, loading, error } = useSelector(
    (s) => s.attendance
  );

  useEffect(() => {
    dispatch(fetchManagerDashboard());
  }, [dispatch]);

  if (loading && !managerDashboard) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>Manager Dashboard</h2>
      {error && <p className="error">{error}</p>}

      {managerDashboard && (
        <>
          <p>Total Employees: {managerDashboard.totalEmployees}</p>
          <p>
            Today - Present: {managerDashboard.today.present}, Absent:{" "}
            {managerDashboard.today.absent}, Late:{" "}
            {managerDashboard.today.late}
          </p>

          <h3>Weekly Attendance Trend</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={managerDashboard.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <h3>Department-wise Attendance (Today)</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={managerDashboard.deptWise}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h3>Absent Employees Today</h3>
          <ul>
            {managerDashboard.absentEmployees.map((emp) => (
              <li key={emp._id}>
                {emp.name} ({emp.employeeId}) - {emp.department}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ManagerDashboardPage;
