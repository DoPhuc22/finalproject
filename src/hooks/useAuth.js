import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { login, logout, register } from "../services/auth";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          setCurrentUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const response = await login(credentials);

      // Update auth state
      setCurrentUser(response.user || response);
      setIsAuthenticated(true);

      message.success("Đăng nhập thành công!");
      return response;
    } catch (error) {
      console.error("Login error:", error);
      message.error("Đăng nhập thất bại");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();

      // Update auth state
      setCurrentUser(null);
      setIsAuthenticated(false);

      message.success("Đăng xuất thành công!");
    } catch (error) {
      console.error("Logout error:", error);

      // Even if API fails, clear local state
      setCurrentUser(null);
      setIsAuthenticated(false);

      message.info("Đã đăng xuất");
    } finally {
      setLoading(false);
    }
  };

  const [customers, setCustomers] = useState([]);
  const fetchCustomers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllUsers(params);
      const data = response.data || response;

      // Filter only customers (not admin users) and add additional info
      let customersOnly = data
        .filter((user) => user.role !== "admin")
        .map((customer) => ({
          ...customer,
          joinDate: customer.createdAt || new Date().toISOString(),
          orderCount: Math.floor(Math.random() * 20) + 1,
          totalSpent: Math.floor(Math.random() * 10000000) + 500000,
        }));

      setCustomers(customersOnly);
      setPagination((prev) => ({
        ...prev,
        total: customersOnly.length,
      }));

      // Lưu vào localStorage nếu không có filter
      if (Object.keys(params).length === 0) {
        localStorage.setItem("customers", JSON.stringify(customersOnly));
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách khách hàng");
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  // Register function
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      const response = await register(userData);
      message.success("Đăng ký thành công!");
      localStorage.removeItem("customers");
      fetchCustomers();
      return response;
    } catch (error) {
      console.error("Register error:", error);
      message.error("Đăng ký thất bại");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUser,
    isAuthenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };
};
