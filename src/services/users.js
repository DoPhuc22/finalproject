import api from "../utils/request";

// API endpoints cho user management
const USER_ENDPOINTS = {
  BASE: "/users",
  BY_ID: (id) => `/users/${id}`,
};

// Lấy thông tin user theo ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(USER_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Cập nhật thông tin user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(USER_ENDPOINTS.BY_ID(id), {
      userId: userData.userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role || 'customer', // Mặc định là 'customer' nếu không có role
      status: userData.status || 'active',
      gender: userData.gender,
      resetToken: userData.resetToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa user (hard delete)
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(USER_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tất cả users
export const getAllUsers = async () => {
  try {
    const response = await api.get(USER_ENDPOINTS.BASE);
    return response;
  } catch (error) {
    throw error;
  }
};

// Tạo user mới
export const createUser = async (userData) => {
  try {
    const response = await api.post(USER_ENDPOINTS.BASE, {
      userId: userData.userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role,
      gender: userData.gender,
      resetToken: userData.resetToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
