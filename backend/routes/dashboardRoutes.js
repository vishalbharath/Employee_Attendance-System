const express = require("express");
const router = express.Router();
const { protect, managerOnly } = require("../middleware/authMiddleware");
const {
  getEmployeeDashboard,
  getManagerDashboard,
} = require("../controllers/dashboardController");

router.get("/employee", protect, getEmployeeDashboard);
router.get("/manager", protect, managerOnly, getManagerDashboard);

module.exports = router;
