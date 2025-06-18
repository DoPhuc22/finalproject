import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser, getToken } from '../../services/auth';

export const restoreAuthState = createAsyncThunk(
  'auth/restoreAuthState',
  async () => {
    const user = getCurrentUser();
    const token = getToken();
    return { user, token };
  }
);

export const updateUserInfo = createAsyncThunk(
  'auth/updateUserInfo',
  async (userData) => {
    // Update localStorage với thông tin người dùng mới
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return userData;
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreAuthState.fulfilled, (state, action) => {
        if (action.payload.user && action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload
        };
      });
  },
});

export const { loginSuccess, logout, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;