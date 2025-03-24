// filepath: watch-store/src/utils/validators.js

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password.length >= 6; // Minimum length of 6 characters
};

export const validateRequired = (value) => {
  return value.trim() !== '';
};

export const validatePhoneNumber = (phone) => {
  const re = /^\d{10}$/; // Example for a 10-digit phone number
  return re.test(String(phone));
};