import axios from "axios";
import { getToken } from "../utils/utils";

// Tạo instance mặc định
const api = axios.create({
  baseURL:
    typeof window !== "undefined" && window.REACT_APP_API_URL
      ? window.REACT_APP_API_URL
      : "http://localhost:8080/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor cho request (ví dụ: thêm token)
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? getToken() : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm interceptor cho response (xử lý lỗi chung)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Xử lý lỗi toàn cục
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }

    if (error.response?.status === 403) {
      // Không có quyền truy cập
      console.error("Không có quyền truy cập");
    }

    if (error.response?.status >= 500) {
      // Lỗi server
      console.error("Lỗi hệ thống, vui lòng thử lại sau");
    }

    // Trả về error.response.data nếu có, nếu không thì trả về error message
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
