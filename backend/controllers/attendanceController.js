// backend/controllers/attendanceController.js
const Attendance = require("../models/Attendance");
const User = require("../models/User");

const getToday = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Employee: Check-in
const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    if (req.user.role !== "employee") {
      return res.status(403).json({ message: "Employees only" });
    }

    const today = getToday();
    let record = await Attendance.findOne({ userId, date: today });

    if (record && record.checkInTime) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5); // "HH:MM"

    // determine status
    const [h, m] = timeStr.split(":").map(Number);
    const isLate = h > 9 || (h === 9 && m > 30);

    const status = isLate ? "late" : "present";

    if (!record) {
      record = await Attendance.create({
        userId,
        date: today,
        checkInTime: timeStr,
        status,
      });
    } else {
      record.checkInTime = timeStr;
      record.status = status;
      await record.save();
    }

    return res.json({ message: "Checked in", record });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


// Employee: Check-out
const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    if (req.user.role !== "employee") {
      return res.status(403).json({ message: "Employees only" });
    }

    const today = getToday();
    const record = await Attendance.findOne({ userId, date: today });

    if (!record || !record.checkInTime) {
      return res.status(400).json({ message: "No check-in found today" });
    }

    if (record.checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    record.checkOutTime = timeStr;

    const [inH, inM] = record.checkInTime.split(":").map(Number);
    const [outH, outM] = record.checkOutTime.split(":").map(Number);
    const diffHours = outH + outM / 60 - (inH + inM / 60);
    const totalHours = Math.max(0, Number(diffHours.toFixed(2)));
    record.totalHours = totalHours;

    // set half-day if hours < 4
    if (totalHours > 0 && totalHours < 4) {
      record.status = "half-day";
    }

    await record.save();
    return res.json({ message: "Checked out", record });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


// Employee: my history
const myHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await Attendance.find({ userId }).sort({ date: -1 });
    return res.json(history);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// Employee: my summary (month/year via query)
const mySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;
    const m = month || new Date().getMonth() + 1;
    const y = year || new Date().getFullYear();

    const monthStr = String(m).padStart(2, "0");
    const regex = new RegExp(`^${y}-${monthStr}-`);

    const records = await Attendance.find({
      userId,
      date: { $regex: regex },
    });

    let present = 0,
      absent = 0,
      late = 0,
      halfDay = 0,
      totalHours = 0;

    records.forEach((r) => {
      if (r.status === "present") present++;
      if (r.status === "absent") absent++;
      if (r.status === "late") late++;
      if (r.status === "half-day") halfDay++;
      totalHours += r.totalHours || 0;
    });

    return res.json({
      month: m,
      year: y,
      present,
      absent,
      late,
      halfDay,
      totalHours,
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// Employee: today's status
const todayStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = getToday();
    const rec = await Attendance.findOne({ userId, date: today });
    return res.json(rec || { message: "No record for today" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// Manager: all employees attendance
const allAttendance = async (req, res) => {
  try {
    const { employeeId, status, date } = req.query;

    const query = {};
    if (date) query.date = date;

    let records = await Attendance.find(query).populate(
      "userId",
      "name employeeId department role"
    );

    if (employeeId) {
      records = records.filter((r) => r.userId.employeeId === employeeId);
    }
    if (status) {
      records = records.filter((r) => r.status === status);
    }

    return res.json(records);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// Manager: specific employee
const employeeAttendance = async (req, res) => {
  try {
    const userId = req.params.id;
    const records = await Attendance.find({ userId }).sort({ date: -1 });
    return res.json(records);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// Manager: team summary (kept simple)
const teamSummary = async (req, res) => {
  try {
    const { date } = req.query;
    const d = date || getToday();

    const records = await Attendance.find({ date: d }).populate(
      "userId",
      "name employeeId department role"
    );

    const totalEmployees = await User.countDocuments({ role: "employee" });
    const present = records.filter((r) => r.status === "present").length;
    const late = records.filter((r) => r.status === "late").length;
    const halfDay = records.filter((r) => r.status === "half-day").length;
    const absent = totalEmployees - present;

    return res.json({
      date: d,
      totalEmployees,
      present,
      absent,
      late,
      halfDay,
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// Manager: export CSV
const exportCsv = async (req, res) => {
  try {
    const records = await Attendance.find().populate(
      "userId",
      "name employeeId department"
    );
    const header =
      "Date,Name,EmployeeId,Department,CheckIn,CheckOut,Status,TotalHours\n";

    const rows = records
      .map((r) =>
        [
          r.date,
          r.userId?.name || "",
          r.userId?.employeeId || "",
          r.userId?.department || "",
          r.checkInTime || "",
          r.checkOutTime || "",
          r.status,
          r.totalHours || 0,
        ].join(",")
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");
    return res.send(header + rows);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// Manager: today's status list
const todayStatusList = async (req, res) => {
  try {
    const today = getToday();
    const records = await Attendance.find({ date: today }).populate(
      "userId",
      "name employeeId department"
    );
    return res.json(records);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
const getTeamCalendar = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).getDate();
    const end = `${year}-${String(month).padStart(2, "0")}-${endDate}`;

    const records = await Attendance.find({
      date: { $gte: start, $lte: end },
    }).populate("userId", "name employeeId department");

    const grouped = {};

    // Group by date
    records.forEach((rec) => {
      if (!grouped[rec.date]) {
        grouped[rec.date] = {
          date: rec.date,
          present: 0,
          absent: 0,
          late: 0,
          halfday: 0,
          employees: [],
        };
      }

      grouped[rec.date].employees.push({
        name: rec.userId.name,
        employeeId: rec.userId.employeeId,
        department: rec.userId.department,
        status: rec.status,
        checkInTime: rec.checkInTime,
        checkOutTime: rec.checkOutTime,
      });

      if (rec.status === "present") grouped[rec.date].present++;
      if (rec.status === "late") grouped[rec.date].late++;
      if (rec.status === "half-day") grouped[rec.date].halfday++;
    });

    // Dates without entries → mark all as ABSENT
    const allEmployees = await User.find({ role: "employee" });

    for (let day = 1; day <= endDate; day++) {
      const d = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      if (!grouped[d]) {
        grouped[d] = {
          date: d,
          present: 0,
          late: 0,
          halfday: 0,
          absent: allEmployees.length,
          employees: allEmployees.map((e) => ({
            name: e.name,
            employeeId: e.employeeId,
            department: e.department,
            status: "absent",
          })),
        };
      }
    }

    const result = Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));

    return res.json(result);
  } catch (err) {
    console.error("Calendar Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  checkIn,
  checkOut,
  myHistory,
  mySummary,
  todayStatus,
  allAttendance,
  employeeAttendance,
  teamSummary,
  exportCsv,
  todayStatusList,
  getTeamCalendar,
};
