import api from '../utils/request';

// API endpoints cho checkout
const CHECKOUT_ENDPOINTS = {
  BASE: '/checkout',
};

// Thực hiện checkout
export const processCheckout = async (checkoutData) => {
  try {
    const response = await api.post(CHECKOUT_ENDPOINTS.BASE, {
      discountCode: checkoutData.discountCode,
      paymentMethod: checkoutData.paymentMethod,
      shippingAddress: checkoutData.shippingAddress,
      receiverName: checkoutData.receiverName,
      receiverPhone: checkoutData.receiverPhone
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Validate discount code
export const validateDiscountCode = async (discountCode) => {
  try {
    const response = await api.post(`${CHECKOUT_ENDPOINTS.BASE}/validate-discount`, {
      discountCode
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Calculate checkout total
export const calculateCheckoutTotal = async (checkoutData) => {
  try {
    const response = await api.post(`${CHECKOUT_ENDPOINTS.BASE}/calculate`, {
      discountCode: checkoutData.discountCode,
      items: checkoutData.items
    });
    return response;
  } catch (error) {
    throw error;
  }
};