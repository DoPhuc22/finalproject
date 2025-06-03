import api from '../utils/request';

// API endpoints cho categories
const CATEGORY_ENDPOINTS = {
  BASE: '/categories',
  BY_ID: (id) => `/categories/${id}`,
};

// Lấy thông tin category theo ID
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(CATEGORY_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Cập nhật category
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(CATEGORY_ENDPOINTS.BY_ID(id), {
      categoryId: categoryData.categoryId,
      name: categoryData.name,
      description: categoryData.description
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa category
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(CATEGORY_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tất cả categories
export const getAllCategories = async () => {
  try {
    const response = await api.get(CATEGORY_ENDPOINTS.BASE);
    return response;
  } catch (error) {
    throw error;
  }
};

// Tạo category mới
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post(CATEGORY_ENDPOINTS.BASE, {
      categoryId: categoryData.categoryId,
      name: categoryData.name,
      description: categoryData.description
    });
    return response;
  } catch (error) {
    throw error;
  }
};