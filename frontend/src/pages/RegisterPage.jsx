import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
  });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  dispatch(
    register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,          // "employee" or "manager"
      department: form.department,
    })
  );
};


  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />
        <select
  name="role"
  value={form.role}
  onChange={handleChange}
>
  <option value="employee">Employee</option>
  <option value="manager">Manager</option>
</select>

        <button type="submit" disabled={loading}>
          Register
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RegisterPage;
