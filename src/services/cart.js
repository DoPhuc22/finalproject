import api from '../utils/request';

// API endpoints cho cart
const CART_ENDPOINTS = {
  BASE: (userId) => `/users/${userId}/cart`,
  ITEM: (userId, itemId) => `/users/${userId}/cart/${itemId}`,
};

// Lấy giỏ hàng của user
export const getUserCart = async (userId) => {
  try {
    console.log('getUserCart called with userId:', userId);
    const response = await api.get(CART_ENDPOINTS.BASE(userId));
    console.log('getUserCart response:', response);
    
    // Ensure consistent response format
    return {
      data: response.data || response,
      items: response.data?.items || response.items || []
    };
  } catch (error) {
    console.error('getUserCart error:', error);
    
    // Return empty cart structure on error
    if (error.response?.status === 404) {
      return {
        data: { items: [] },
        items: []
      };
    }
    
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (userId, cartItemData) => {
  try {
    console.log('addToCart called:', { userId, cartItemData });
    const payload = {
      itemId: cartItemData.itemId,
      productId: cartItemData.productId,
      quantity: cartItemData.quantity
    };
    console.log('addToCart payload:', payload);
    
    const response = await api.post(CART_ENDPOINTS.BASE(userId), payload);
    console.log('addToCart response:', response);
    return response;
  } catch (error) {
    console.error('addToCart error:', error);
    throw error;
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (userId) => {
  try {
    const response = await api.delete(CART_ENDPOINTS.BASE(userId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa một item khỏi giỏ hàng
export const removeCartItem = async (userId, itemId) => {
  try {
    const response = await api.delete(CART_ENDPOINTS.ITEM(userId, itemId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Cập nhật số lượng item trong giỏ hàng
export const updateCartItem = async (userId, cartItemData) => {
  try {
    const response = await api.put(CART_ENDPOINTS.BASE(userId), cartItemData);
    return response;
  } catch (error) {
    throw error;
  }
};