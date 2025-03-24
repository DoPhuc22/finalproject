// filepath: watch-store/src/services/auth.js
import axios from 'axios';

const API_URL = '/api/auth/';

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}login`, userData);
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_URL}logout`);
  return response.data;
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};