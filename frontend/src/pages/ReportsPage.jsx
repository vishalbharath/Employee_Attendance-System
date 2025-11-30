import React, { useState } from "react";
import api from "../api/axios";

const ReportsPage = () => {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    employeeId: "",
  });

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleGetSummary = async () => {
    setError("");
    setSummary(null);

    if (!filters.from || !filters.to) {
      setError("Please select both From and To dates.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get("/attendance/summary", {
        params: {
          from: filters.from,
          to: filters.to,
          employeeId: filters.employeeId || undefined,
        },
      });
      setSummary(data);
    } catch (err) {
      setError("Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setError("");

    if (!filters.from || !filters.to) {
      setError("Please select both From and To dates before exporting.");
      return;
    }

    try {
      // Use axios instance so Authorization header (Bearer token) is included
      const response = await api.get("/attendance/export", {
        params: {
          from: filters.from,
          to: filters.to,
          employeeId: filters.employeeId || undefined,
        },
        responseType: "blob", // important: we expect CSV file
      });

      // Create a download link for the CSV
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance_report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to export CSV (unauthorized or server error)");
    }
  };

  return (
    <div className="card">
      <h2>Reports</h2>

      <div className="filters">
        <label>From Date</label>
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleChange}
        />

        <label>To Date</label>
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleChange}
        />

        <label>Employee ID (optional)</label>
        <input
          name="employeeId"
          placeholder="EMP001 or leave blank for all"
          value={filters.employeeId}
          onChange={handleChange}
        />

        <button onClick={handleGetSummary} disabled={loading}>
          {loading ? "Loading..." : "Get Summary"}
        </button>
        <button onClick={handleExport}>Export CSV</button>
      </div>

      {error && <p className="error">{error}</p>}

      {summary && (
        <div className="card" style={{ marginTop: "16px" }}>
          <h3>Summary</h3>
          {summary.mode === "range" ? (
            <>
              <p>
                Range: {summary.from} to {summary.to}
              </p>
              <p>Total Employees: {summary.totalEmployees}</p>
              <p>Present: {summary.present}</p>
              <p>Absent: {summary.absent}</p>
              <p>Late: {summary.late}</p>
              <p>Half-day: {summary.halfDay}</p>
            </>
          ) : (
            <>
              <p>Date: {summary.date}</p>
              <p>Total Employees: {summary.totalEmployees}</p>
              <p>Present: {summary.present}</p>
              <p>Absent: {summary.absent}</p>
              <p>Late: {summary.late}</p>
              <p>Half-day: {summary.halfDay}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
