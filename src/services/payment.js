// filepath: watch-store/src/services/payment.js
import axios from 'axios';

const API_URL = 'https://api.example.com/payments';

export const processPayment = async (paymentData) => {
  try {
    const response = await axios.post(API_URL, paymentData);
    return response.data;
  } catch (error) {
    throw new Error('Payment processing failed: ' + error.message);
  }
};

export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/${paymentId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch payment status: ' + error.message);
  }
};