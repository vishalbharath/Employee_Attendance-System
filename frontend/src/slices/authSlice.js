import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;


const loginTimeFromStorage = localStorage.getItem("loginTime")
  ? Number(localStorage.getItem("loginTime"))
  : null;
  
  
export const login = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Login failed"
    );
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Register failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    loginTime: loginTimeFromStorage,
    loading: false,
    error: null,
  },
reducers: {
  logout(state) {
    state.user = null;
    state.loginTime = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
  },
},

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        const now = Date.now();
        state.loginTime = now;
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("loginTime", String(now));
    })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
          const now = Date.now();
          state.loginTime = now;
          localStorage.setItem("user", JSON.stringify(action.payload));
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("loginTime", String(now));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
