import api from '../utils/request';

// API đăng ký
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      gender: userData.gender,
      address: userData.address,
      role: userData.role || "customer"
    });
    
    // Lưu token và user info vào localStorage
    // if (response.token) {
    //   localStorage.setItem('token', response.token);
    //   localStorage.setItem('user', JSON.stringify(response.user));
    // }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// API đăng nhập
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    console.log('Login response:', response);
    // Lưu token và user info vào localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      const { token, ...user } = response;
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response;
  } catch (error) {
    throw error;
  }
};

// API đăng xuất
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Xóa token và user info khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// API quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', {
      email: email
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// API reset mật khẩu
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token: token,
      newPassword: newPassword
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy thông tin user hiện tại từ localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Kiểm tra xem user có đăng nhập hay không
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  return !!(token && user);
};

// Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};