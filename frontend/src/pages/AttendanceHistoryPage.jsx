import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyHistory } from "../slices/attendanceSlice";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AttendanceHistoryPage = () => {
  const dispatch = useDispatch();
  const { myHistory } = useSelector((s) => s.attendance);

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchMyHistory());
  }, [dispatch]);

  const statusByDate = useMemo(() => {
    const map = {};
    myHistory.forEach((r) => {
      map[r.date] = r;
    });
    return map;
  }, [myHistory]);

  const formatKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    const rec = statusByDate[formatKey(date)];
    if (!rec) return "";

    if (rec.status === "present") return "present-day";
    if (rec.status === "absent") return "absent-day";
    if (rec.status === "late") return "late-day";
    if (rec.status === "half-day") return "halfday-day";
    return "";
  };

  const selectedRecord = statusByDate[formatKey(selectedDate)];

  return (
    <div className="card">
      <h2>My Attendance History</h2>

      <div className="calendar-wrapper">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
        />
        <div className="calendar-legend">
          <span className="legend-box present"></span> Present
          <span className="legend-box absent"></span> Absent
          <span className="legend-box late"></span> Late
          <span className="legend-box halfday"></span> Half-day
        </div>
      </div>

      <h3>Selected Date Details</h3>
      {selectedRecord ? (
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
            <tr>
              <td>{selectedRecord.date}</td>
              <td>{selectedRecord.checkInTime || "-"}</td>
              <td>{selectedRecord.checkOutTime || "-"}</td>
              <td>{selectedRecord.status}</td>
              <td>{selectedRecord.totalHours}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No record for this date.</p>
      )}

      <h3>All Records</h3>
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
          {myHistory.length === 0 && (
            <tr>
              <td colSpan="5">No records</td>
            </tr>
          )}
          {myHistory.map((r) => (
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
    </div>
  );
};

export default AttendanceHistoryPage;
