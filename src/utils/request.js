import axios from "axios";
import { getToken } from "../services/auth";

// Tạo instance axios
const api = axios.create({
  baseURL:
    typeof window !== "undefined" && window.REACT_APP_API_URL
      ? window.REACT_APP_API_URL
      : "https://watch-deployment.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor request để đính kèm token vào header
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor response để xử lý response hoặc error
api.interceptors.response.use(
  (response) => {
    try {
      // Nếu API trả về response.data.data, thì trả về response.data
      if (response.data && typeof response.data === "object") {
        return response.data;
      }
      // Trường hợp khác, trả về nguyên response.data
      return response.data;
    } catch (error) {
      console.error("Error processing API response:", error);
      return response.data;
    }
  },
  (error) => {
    // Xử lý lỗi toàn cục
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      if (token) {
        // Token hết hạn hoặc không hợp lệ
        console.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        // Không xóa token và user để tránh gây ra bug khi sử dụng trang profile
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");

        // Không tự động redirect, để component xử lý
        // window.location.href = "/auth";
      }
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
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
