import api from '../utils/request';

// API endpoints cho discounts
const DISCOUNT_ENDPOINTS = {
  BASE: '/discounts',
  BY_ID: (id) => `/discounts/${id}`,
};

// Lấy thông tin discount theo ID
export const getDiscountById = async (id) => {
  try {
    const response = await api.get(DISCOUNT_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Cập nhật discount
export const updateDiscount = async (id, discountData) => {
  try {
    const response = await api.put(DISCOUNT_ENDPOINTS.BY_ID(id), {
      discountId: discountData.discountId,
      code: discountData.code,
      type: discountData.type,
      value: discountData.value,
      validFrom: discountData.validFrom,
      validUntil: discountData.validUntil,
      maxUses: discountData.maxUses,
      usesCount: discountData.usesCount,
      active: discountData.active
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa discount
export const deleteDiscount = async (id) => {
  try {
    const response = await api.delete(DISCOUNT_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tất cả discounts
export const getAllDiscounts = async () => {
  try {
    const response = await api.get(DISCOUNT_ENDPOINTS.BASE);
    return response;
  } catch (error) {
    throw error;
  }
};

// Tạo discount mới
export const createDiscount = async (discountData) => {
  try {
    const response = await api.post(DISCOUNT_ENDPOINTS.BASE, {
      discountId: discountData.discountId,
      code: discountData.code,
      type: discountData.type,
      value: discountData.value,
      validFrom: discountData.validFrom,
      validUntil: discountData.validUntil,
      maxUses: discountData.maxUses,
      usesCount: discountData.usesCount,
      active: discountData.active
    });
    return response;
  } catch (error) {
    throw error;
  }
};