const Attendance = require("../models/Attendance");
const User = require("../models/User");

const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const todayStr = `${y}-${m}-${String(today.getDate()).padStart(2, "0")}`;

    const monthRegex = new RegExp(`^${y}-${m}-`);

    const records = await Attendance.find({
      userId,
      date: { $regex: monthRegex },
    }).sort({ date: -1 });

    let present = 0,
      absent = 0,
      late = 0;
    let totalHours = 0;

    records.forEach((r) => {
      if (r.status === "present") present++;
      if (r.status === "absent") absent++;
      if (r.status === "late") late++;
      totalHours += r.totalHours || 0;
    });

    const recent = records.slice(0, 7);
    const todayRecord = records.find((r) => r.date === todayStr);

    return res.json({
      todayStatus: todayRecord ? "Checked In" : "Not Checked In",
      present,
      absent,
      late,
      totalHours,
      recent,
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const getManagerDashboard = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });

    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}`;

    const todayRecords = await Attendance.find({ date: todayStr }).populate(
      "userId",
      "name employeeId department"
    );

    const present = todayRecords.filter((r) => r.status === "present").length;
    const absentEmployees = await User.find({
      role: "employee",
      _id: { $nin: todayRecords.map((r) => r.userId._id) },
    });

    // Weekly trend (simplified: last 7 days count)
    const trend = []; // [{date, presentCount}]
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const yy = day.getFullYear();
      const mm = String(day.getMonth() + 1).padStart(2, "0");
      const dd = String(day.getDate()).padStart(2, "0");
      const ds = `${yy}-${mm}-${dd}`;
      const recs = await Attendance.find({ date: ds });
      trend.push({ date: ds, present: recs.length });
    }

    // Department-wise attendance today
    const deptMap = {};
    todayRecords.forEach((r) => {
      const dept = r.userId.department || "Unknown";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    const deptData = Object.keys(deptMap).map((k) => ({
      department: k,
      present: deptMap[k],
    }));

    return res.json({
      totalEmployees,
      today: {
        present,
        absent: totalEmployees - present,
        late: todayRecords.filter((r) => r.status === "late").length,
      },
      weeklyTrend: trend,
      deptWise: deptData,
      absentEmployees,
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getEmployeeDashboard, getManagerDashboard };
