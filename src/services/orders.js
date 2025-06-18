import api from '../utils/request';

// API endpoints cho orders
const ORDER_ENDPOINTS = {
  BASE: '/orders',
  BY_ID: (id) => `/orders/${id}`,
  USER_ORDERS: (userId) => `/users/${userId}/orders`,
};

// Lấy danh sách tất cả orders
export const getAllOrders = async () => {
  try {
    const response = await api.get(ORDER_ENDPOINTS.BASE);
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách đơn hàng của user
export const getUserOrders = async (userId) => {
  try {
    const response = await api.get(ORDER_ENDPOINTS.USER_ORDERS(userId));
    return response;
  } catch (error) {
    throw error;
  }
};

// Tạo order mới
export const createOrder = async (orderData) => {
  try {
    const response = await api.post(ORDER_ENDPOINTS.BASE, {
      orderId: orderData.orderId,
      userId: orderData.userId,
      details: orderData.details,
      subtotal: orderData.subtotal,
      discountAmount: orderData.discountAmount,
      total: orderData.total,
      status: orderData.status,
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      receiverName: orderData.receiverName,
      receiverPhone: orderData.receiverPhone,
      orderDate: orderData.orderDate,
      updatedAt: orderData.updatedAt
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy thông tin order theo ID
export const getOrderById = async (id) => {
  try {
    const response = await api.get(ORDER_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa order
export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(ORDER_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Cập nhật order
export const updateOrder = async (id, orderData) => {
  try {
    const response = await api.put(ORDER_ENDPOINTS.BY_ID(id), {
      orderId: orderData.orderId,
      userId: orderData.userId,
      details: orderData.details,
      subtotal: orderData.subtotal,
      discountAmount: orderData.discountAmount,
      total: orderData.total,
      status: orderData.status,
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      receiverName: orderData.receiverName,
      receiverPhone: orderData.receiverPhone,
      orderDate: orderData.orderDate,
      updatedAt: orderData.updatedAt
    });
    return response;
  } catch (error) {
    throw error;
  }
};