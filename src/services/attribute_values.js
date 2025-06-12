import api from "../utils/request";

// API endpoints cho attribute values
const ATTRIBUTE_ENDPOINTS = {
  BASE: "/attribute-values",
  BY_ID: (id) => `/attribute-values/${id}`,
};

// Lấy thông tin attribute value theo ID
export const getAttributeValueById = async (id) => {
  try {
    const response = await api.get(ATTRIBUTE_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Cập nhật attribute value
export const updateAttributeValue = async (id, attributeData) => {
  try {
    const response = await api.put(ATTRIBUTE_ENDPOINTS.BY_ID(id), {
      attrValueId: attributeData.attrValueId,
      name: attributeData.name,
      value: attributeData.value,
      status: attributeData.status || "active",

    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa attribute value
export const deleteAttributeValue = async (id) => {
  try {
    const response = await api.delete(ATTRIBUTE_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tất cả attribute values
export const getAllAttributeValues = async () => {
  try {
    const response = await api.get(ATTRIBUTE_ENDPOINTS.BASE);
    return response;
  } catch (error) {
    throw error;
  }
};

// Tạo attribute value mới
export const createAttributeValue = async (attributeData) => {
  try {
    const response = await api.post(ATTRIBUTE_ENDPOINTS.BASE, {
      attrValueId: attributeData.attrValueId,
      name: attributeData.name,
      value: attributeData.value,
      status: attributeData.status || "active",
    });
    return response;
  } catch (error) {
    throw error;
  }
};
