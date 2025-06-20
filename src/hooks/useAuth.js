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

  // Register function
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      const response = await register(userData);
      message.success("Đăng ký thành công!");
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