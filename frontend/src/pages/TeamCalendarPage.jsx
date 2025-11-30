import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import { fetchTeamCalendar } from "../slices/attendanceSlice";

const TeamCalendarPage = () => {
  const dispatch = useDispatch();
  const { teamCalendar } = useSelector((s) => s.attendance);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    dispatch(fetchTeamCalendar({ month, year }));
  }, [dispatch, month, year]);

  const map = useMemo(() => {
    const m = {};
    teamCalendar.forEach((day) => (m[day.date] = day));
    return m;
  }, [teamCalendar]);

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    const key = formatDate(date);
    const rec = map[key];
    if (!rec) return "";

    if (rec.present > rec.absent) return "present-day";
    if (rec.absent > rec.present) return "absent-day";
    if (rec.late > 0) return "late-day";
    if (rec.halfday > 0) return "halfday-day";

    return "";
  };

  const handleDateClick = (d) => {
    const key = formatDate(d);
    setSelected(map[key]);
  };

  return (
    <div className="card">
      <h2>Team Calendar</h2>

      <Calendar
        value={currentDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          setCurrentDate(activeStartDate)
        }
        onClickDay={handleDateClick}
        tileClassName={tileClassName}
      />

      {selected && (
        <div className="card" style={{ marginTop: "16px" }}>
          <h3>Attendance on {selected.date}</h3>
          <p>Present: {selected.present}</p>
          <p>Absent: {selected.absent}</p>
          <p>Late: {selected.late}</p>
          <p>Half-day: {selected.halfday}</p>

          <table style={{ marginTop: "12px" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {selected.employees.map((e) => (
                <tr key={e.employeeId}>
                  <td>{e.name}</td>
                  <td>{e.employeeId}</td>
                  <td>{e.department}</td>
                  <td>{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamCalendarPage;
