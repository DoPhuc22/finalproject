import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginAPI } from "../../services/auth";

// Hàm lấy initial state từ localStorage
const getInitialState = () => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (token && user) {
      return {
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error parsing stored auth data:", error);
    // Xóa dữ liệu lỗi
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

// Tạo async thunk action để xử lý đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Đăng nhập thất bại");
    }
  }
);

const initialState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      // Xóa khỏi localStorage khi logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    // Thêm action để khôi phục state từ localStorage
    restoreAuthState: (state) => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        if (token && user) {
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        }
      } catch (error) {
        console.error("Error restoring auth state:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
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
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  restoreAuthState,
} = authSlice.actions;

export default authSlice.reducer;
