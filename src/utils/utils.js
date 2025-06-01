// Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Lưu token vào localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Xóa token khỏi localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Lưu user info vào localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Lấy user info từ localStorage
export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Xóa user info khỏi localStorage
export const removeUser = () => {
  localStorage.removeItem('user');
};

// Clear all auth data
export const clearAuthData = () => {
  removeToken();
  removeUser();
};