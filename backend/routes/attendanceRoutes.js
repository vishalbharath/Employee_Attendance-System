// backend/routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();

const { protect, managerOnly } = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/attendanceController");

// Employee routes
router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);
router.get("/my-history", protect, myHistory);
router.get("/my-summary", protect, mySummary);
router.get("/today", protect, todayStatus);

// Manager routes
router.get("/all", protect, managerOnly, allAttendance);
router.get("/employee/:id", protect, managerOnly, employeeAttendance);
router.get("/summary", protect, managerOnly, teamSummary);
router.get("/export", protect, managerOnly, exportCsv);
router.get("/today-status", protect, managerOnly, todayStatusList);
router.get("/team-calendar", protect, managerOnly, getTeamCalendar);


module.exports = router;
