import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeDashboard,
  checkIn,
  checkOut,
} from "../slices/attendanceSlice";

const EmployeeDashboardPage = () => {
  const dispatch = useDispatch();
  const { employeeDashboard, loading, error } = useSelector(
    (s) => s.attendance
  );

  useEffect(() => {
    dispatch(fetchEmployeeDashboard());
  }, [dispatch]);

  const handleCheckIn = () => dispatch(checkIn()).then(() => dispatch(fetchEmployeeDashboard()));
  const handleCheckOut = () => dispatch(checkOut()).then(() => dispatch(fetchEmployeeDashboard()));

  if (loading && !employeeDashboard) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>Employee Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {employeeDashboard && (
        <>
          <p>Today's Status: {employeeDashboard.todayStatus}</p>
          <p>
            This month - Present: {employeeDashboard.present}, Absent:{" "}
            {employeeDashboard.absent}, Late: {employeeDashboard.late}
          </p>
          <p>Total Hours this month: {employeeDashboard.totalHours}</p>

          <div className="buttons">
            <button onClick={handleCheckIn}>Quick Check In</button>
            <button onClick={handleCheckOut}>Quick Check Out</button>
          </div>

          <h3>Recent 7 Days</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {employeeDashboard.recent.map((r) => (
                <tr key={r._id}>
                  <td>{r.date}</td>
                  <td>{r.checkInTime || "-"}</td>
                  <td>{r.checkOutTime || "-"}</td>
                  <td>{r.status}</td>
                  <td>{r.totalHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EmployeeDashboardPage;
