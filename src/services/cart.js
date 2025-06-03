import api from '../utils/request';

// API endpoints cho cart
const CART_ENDPOINTS = {
  BASE: (userId) => `/users/${userId}/cart`,
  ITEM: (userId, itemId) => `/users/${userId}/cart/${itemId}`,
};

// Lấy giỏ hàng của user
export const getUserCart = async (userId) => {
  try {
    const response = await api.get(CART_ENDPOINTS.BASE(userId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (userId, cartItemData) => {
  try {
    const response = await api.post(CART_ENDPOINTS.BASE(userId), {
      itemId: cartItemData.itemId,
      productId: cartItemData.productId,
      quantity: cartItemData.quantity
    });
    return response;
  } catch (error) {
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
export const updateCartItem = async (userId, itemId, cartItemData) => {
  try {
    const response = await api.put(CART_ENDPOINTS.ITEM(userId, itemId), {
      itemId: cartItemData.itemId,
      productId: cartItemData.productId,
      quantity: cartItemData.quantity
    });
    return response;
  } catch (error) {
    throw error;
  }
};