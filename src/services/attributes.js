import api from '../utils/request';

// API endpoints cho attribute types
const ATTRIBUTE_ENDPOINTS = {
  BASE: '/attribute-types',
  BY_ID: (id) => `/attribute-types/${id}`,
};

// Lấy thông tin attribute type theo ID
export const getAttributeTypeById = async (id) => {
  try {
    const response = await api.get(ATTRIBUTE_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Cập nhật attribute type
export const updateAttributeType = async (id, attributeData) => {
  try {
    const response = await api.put(ATTRIBUTE_ENDPOINTS.BY_ID(id), {
      attrTypeId: attributeData.attrTypeId,
      name: attributeData.name
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa attribute type
export const deleteAttributeType = async (id) => {
  try {
    const response = await api.delete(ATTRIBUTE_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tất cả attribute types
export const getAllAttributeTypes = async () => {
  try {
    const response = await api.get(ATTRIBUTE_ENDPOINTS.BASE);
    return response;
  } catch (error) {
    throw error;
  }
};

// Tạo attribute type mới
export const createAttributeType = async (attributeData) => {
  try {
    const response = await api.post(ATTRIBUTE_ENDPOINTS.BASE, {
      attrTypeId: attributeData.attrTypeId,
      name: attributeData.name
    });
    return response;
  } catch (error) {
    throw error;
  }
};