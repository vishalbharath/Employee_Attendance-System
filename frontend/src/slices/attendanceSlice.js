import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Employee-facing
export const fetchEmployeeDashboard = createAsyncThunk(
  "attendance/employeeDashboard",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/dashboard/employee");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load dashboard");
    }
  }
);

export const checkIn = createAsyncThunk(
  "attendance/checkIn",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.post("/attendance/checkin");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Check-in failed"
      );
    }
  }
);

export const checkOut = createAsyncThunk(
  "attendance/checkOut",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.post("/attendance/checkout");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Check-out failed"
      );
    }
  }
);

export const fetchMyHistory = createAsyncThunk(
  "attendance/myHistory",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/attendance/my-history");
      return data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to load history");
    }
  }
);

// Manager-facing
export const fetchManagerDashboard = createAsyncThunk(
  "attendance/managerDashboard",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/dashboard/manager");
      return data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to load manager dashboard");
    }
  }
);

export const fetchAllAttendance = createAsyncThunk(
  "attendance/all",
  async (params, thunkAPI) => {
    try {
      const { data } = await api.get("/attendance/all", { params });
      return data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to load attendance");
    }
  }
);

export const fetchTeamCalendar = createAsyncThunk(
  "attendance/teamCalendar",
  async ({ month, year }, thunkAPI) => {
    try {
      const { data } = await api.get("/attendance/team-calendar", {
        params: { month, year },
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load calendar");
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    employeeDashboard: null,
    myHistory: [],
    managerDashboard: null,
    allAttendance: [],
    loading: false,
    error: null,
    teamCalendar: [],

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeDashboard.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchEmployeeDashboard.fulfilled, (s, a) => {
        s.loading = false;
        s.employeeDashboard = a.payload;
      })
      .addCase(fetchEmployeeDashboard.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchMyHistory.fulfilled, (s, a) => {
        s.myHistory = a.payload;
      })
      .addCase(fetchManagerDashboard.fulfilled, (s, a) => {
        s.managerDashboard = a.payload;
      })
      .addCase(fetchAllAttendance.fulfilled, (s, a) => {
        s.allAttendance = a.payload;
      })
      .addCase(checkIn.fulfilled, (s) => {
        s.error = null;
      })
      .addCase(checkIn.rejected, (s, a) => {
        s.error = a.payload;
      })
      .addCase(checkOut.rejected, (s, a) => {
        s.error = a.payload;
      })
      .addCase(fetchTeamCalendar.pending, (state) => {
        state.loading = true;
      })
       .addCase(fetchTeamCalendar.fulfilled, (state, action) => {
         state.loading = false;
         state.teamCalendar = action.payload;
       })
       .addCase(fetchTeamCalendar.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload;
       });

  },
});

export default attendanceSlice.reducer;
