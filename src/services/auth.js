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
    
    console.log('API Login response:', response);
    
    // Lưu token và user info vào localStorage
    if (response && response.token) {
      localStorage.setItem('token', response.token);
      
      // Xử lý dữ liệu người dùng
      let userData = {};
      
      // Kiểm tra có dữ liệu user không
      if (response.user) {
        userData = {...response.user};
      } else if (response.data && response.data.user) {
        userData = {...response.data.user};
      } else {
        // Trường hợp response chứa thông tin user trực tiếp
        userData = {...response};
        delete userData.token; // Không lưu token vào đối tượng user
      }
      
      // Đảm bảo dữ liệu người dùng chứa id
      if (!userData.id) {
        if (userData.userId) userData.id = userData.userId;
        else if (userData._id) userData.id = userData._id;
        else if (response.userId) userData.id = response.userId;
        else if (response._id) userData.id = response._id;
        else userData.id = Date.now().toString(); // Tạo ID tạm thời nếu không có
      }
      
      // Đảm bảo có các thông tin cơ bản
      if (!userData.email && credentials.email) {
        userData.email = credentials.email;
      }
      
      // Lưu thông tin user vào localStorage
      console.log('Saving user data to localStorage:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      console.error('Login response is missing token or invalid:', response);
      throw new Error('Invalid response format from server');
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
    if (!userStr) {
      console.log('No user data found in localStorage');
      return null;
    }
    
    let user;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse user JSON:', e);
      return null;
    }
    
    console.log('Retrieved user data from localStorage:', user);
    
    // Đảm bảo dữ liệu người dùng chứa id
    if (!user.id && (user.userId || user._id)) {
      user.id = user.userId || user._id;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    // Nếu vẫn không có ID, tạo ID tạm thời
    if (!user.id) {
      user.id = Date.now().toString();
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user data:', error);
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