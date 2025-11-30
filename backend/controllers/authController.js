const User = require("../models/User");


const generateToken = require("../utils/generateToken");

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

    // Role-based ID prefix
    const prefix = role === "manager" ? "MGR" : "EMP";

    // Count existing users of this role for ID sequence
    const countForRole = await User.countDocuments({ role });

    const employeeId = `${prefix}${String(countForRole + 1).padStart(
      3,
      "0"
    )}`;

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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getMe = async (req, res) => {
  const user = req.user;
  return res.json(user);
};

module.exports = {
  register,
  login,
  getMe,
};

