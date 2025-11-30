const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    let prefix = "EMP";
    if (role === "manager") prefix = "MGR";

    // Count only users with this role for ID sequence
    const count = await User.countDocuments({ role: role || "employee" });

    const employeeId = `${prefix}${String(count + 1).padStart(3, "0")}`;

    const user = await User.create({
      name,
      email,
      password,
      role: role || "employee",
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
    return res.status(500).json({ message: "Server error" });
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

module.exports = { register, login, getMe };
