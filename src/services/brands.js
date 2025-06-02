import api from '../utils/request';

// API endpoints cho brands
const BRAND_ENDPOINTS = {
  BASE: '/brands',
  BY_ID: (id) => `/brands/${id}`,
};

// Lấy thông tin brand theo ID
export const getBrandById = async (id) => {
  try {
    const response = await api.get(BRAND_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Cập nhật brand
export const updateBrand = async (id, brandData) => {
  try {
    const response = await api.put(BRAND_ENDPOINTS.BY_ID(id), {
      brandId: brandData.brandId,
      name: brandData.name,
      description: brandData.description
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa brand
export const deleteBrand = async (id) => {
  try {
    const response = await api.delete(BRAND_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tất cả brands
export const getAllBrands = async () => {
  try {
    const response = await api.get(BRAND_ENDPOINTS.BASE);
    return response;
  } catch (error) {
    throw error;
  }
};

// Tạo brand mới
export const createBrand = async (brandData) => {
  try {
    const response = await api.post(BRAND_ENDPOINTS.BASE, {
      brandId: brandData.brandId,
      name: brandData.name,
      description: brandData.description
    });
    return response;
  } catch (error) {
    throw error;
  }
};