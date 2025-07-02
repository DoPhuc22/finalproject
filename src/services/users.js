import api from "../utils/request";

// API endpoints cho user management
const USER_ENDPOINTS = {
  BASE: "/users",
  BY_ID: (id) => `/users/${id}`,
  CHANGE_PASSWORD: (id) => `/users/${id}/change-password`,
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
    // Clean và validate dữ liệu
    const cleanData = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || "customer",
      status: userData.status || "active",
      gender: userData.gender,
      address: userData.address || "",
    };

    // Chỉ thêm password nếu có và không rỗng
    if (
      userData.password &&
      userData.password.trim() &&
      userData.password.length >= 6
    ) {
      cleanData.password = userData.password;
    }

    console.log("Updating user with clean data:", {
      ...cleanData,
      password: cleanData.password ? "[HIDDEN]" : undefined,
    });

    const response = await api.put(USER_ENDPOINTS.BY_ID(id), cleanData);
    return response;
  } catch (error) {
    console.error("Update user error:", error);
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
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get(USER_ENDPOINTS.BASE, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Tạo user mới
export const createUser = async (userData) => {
  try {
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error("Thiếu thông tin bắt buộc: tên, email và mật khẩu");
    }

    if (userData.password.length < 6) {
      throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
    }

    const cleanData = {
      name: userData.name.trim(),
      email: userData.email.trim(),
      phone: userData.phone?.trim() || "",
      password: userData.password,
      role: userData.role || "customer",
      gender: userData.gender || "M",
      address: userData.address?.trim() || "",
      status: userData.status || "active",
    };

    const response = await api.post(USER_ENDPOINTS.BASE, cleanData);
    return response;
  } catch (error) {
    console.error("Create user error:", error);

    // Improve error handling
    if (error.response?.data) {
      throw new Error(
        error.response.data.message ||
          error.response.data.error ||
          "Lỗi không xác định từ server"
      );
    }

    throw error;
  }
};

export const changePassword = async (id, passwordData) => {
  try {
    const response = await api.post(USER_ENDPOINTS.CHANGE_PASSWORD(id), {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
