import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAttendance } from "../slices/attendanceSlice";
import api from "../api/axios";

const AllAttendancePage = () => {
  const dispatch = useDispatch();
  const { allAttendance } = useSelector((s) => s.attendance);

  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    employeeId: "",
    status: "",
    date: "",
  });

  useEffect(() => {
    // simple endpoint using /auth or you can add /api/users
    const loadEmployees = async () => {
      const { data } = await api.get("/auth/me"); // better: create /users endpoint
      // for now, ignore; you can implement separate /users route
    };
    // TODO: implement separate employees list if needed

    dispatch(fetchAllAttendance({}));
  }, [dispatch]);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleFilter = () => dispatch(fetchAllAttendance(filters));

  return (
    <div className="card">
      <h2>All Employees Attendance</h2>
      <div className="filters">
        <input
          name="employeeId"
          placeholder="Employee ID (EMP001)"
          value={filters.employeeId}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
        />
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All statuses</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="half-day">Half Day</option>
        </select>
        <button onClick={handleFilter}>Apply Filter</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Department</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {allAttendance.length === 0 && (
            <tr>
              <td colSpan="8">No records</td>
            </tr>
          )}
          {allAttendance.map((r) => (
            <tr key={r._id}>
              <td>{r.date}</td>
              <td>{r.userId?.name}</td>
              <td>{r.userId?.employeeId}</td>
              <td>{r.userId?.department}</td>
              <td>{r.checkInTime || "-"}</td>
              <td>{r.checkOutTime || "-"}</td>
              <td>{r.status}</td>
              <td>{r.totalHours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllAttendancePage;
