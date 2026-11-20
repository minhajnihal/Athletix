import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAdmin as loginAdminService } from "../../services/admin/adminService";

// Load existing admin session
const getStoredAdmin = () => {
  try {
    const admin = localStorage.getItem("admin");
    return admin ? JSON.parse(admin) : null;
  } catch {
    localStorage.removeItem("admin");
    return null;
  }
};

// Admin login API
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const admin = await loginAdminService(
        credentials.email,
        credentials.password
      );

      localStorage.setItem("admin", JSON.stringify(admin));
      return admin;
    } catch (error) {
      return rejectWithValue(
        error.message || "Admin login failed"
      );
    }
  }
);

const initialAdmin = getStoredAdmin();

const authSlice = createSlice({
  name: "auth",

  initialState: {
    admin: initialAdmin,
    isAuthenticated: Boolean(initialAdmin),
    loading: false,
    error: null,
  },

  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("admin");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { logoutAdmin, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
