import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkIn, checkOut } from "../slices/attendanceSlice";

const MarkAttendancePage = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((s) => s.attendance);

  return (
    <div className="card">
      <h2>Mark Attendance</h2>
      <div className="buttons">
        <button onClick={() => dispatch(checkIn())}>Check In</button>
        <button onClick={() => dispatch(checkOut())}>Check Out</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default MarkAttendancePage;
