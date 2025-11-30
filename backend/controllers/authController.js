const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// REGISTER (Employee or Manager)
const register = async (req, res) => {
  try {
    let { name, email, password, role, department } = req.body;

    // Normalize role
    role =
      typeof role === "string" ? role.toLowerCase().trim() : "employee";
    if (role !== "manager" && role !== "employee") {
      role = "employee";
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Decide prefix based on role
    const prefix = role === "manager" ? "MGR" : "EMP";

    // Find the current highest employeeId for this role & prefix
    const lastUser = await User.findOne({
      role,
      employeeId: { $regex: `^${prefix}\\d+$` },
    })
      .sort({ employeeId: -1 })
      .lean();

    let nextNumber = 1;
    if (lastUser && lastUser.employeeId) {
      const num = parseInt(lastUser.employeeId.replace(prefix, ""), 10);
      if (!Number.isNaN(num)) {
        nextNumber = num + 1;
      }
    }

    const employeeId = `${prefix}${String(nextNumber).padStart(3, "0")}`;

    const user = await User.create({
      name,
      email,
      password,
      role,
      employeeId,
      department,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET CURRENT USER
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    console.error("GETME ERROR:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login, getMe };
