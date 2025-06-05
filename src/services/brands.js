import api from "../utils/request";

// API endpoints cho brands
const BRAND_ENDPOINTS = {
  BASE: "/brands",
  BY_ID: (id) => `/brands/${id}`,
};

// Lấy thông tin brand theo ID
export const getBrandById = async (id) => {
  try {
    if (!id) throw new Error("Brand ID is required");
    const response = await api.get(BRAND_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    console.error("Get brand by ID error:", error);
    throw error;
  }
};

// Cập nhật brand
export const updateBrand = async (id, brandData) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error("Brand ID is required for update");
    }

    console.log("Update brand API call:", { id, brandData }); // Debug log

    const requestData = {
      brandId: brandData.brandId || id,
      name: brandData.name,
      description: brandData.description,
      status: brandData.status || 'active',
    };

    // Remove undefined values to avoid sending null/undefined to API
    const cleanedData = Object.fromEntries(
      Object.entries(requestData).filter(([_, value]) => value !== undefined)
    );

    console.log("Cleaned data for API:", cleanedData); // Debug log

    const response = await api.put(BRAND_ENDPOINTS.BY_ID(id), cleanedData);
    return response;
  } catch (error) {
    console.error(
      "Update brand error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa brand
export const deleteBrand = async (id) => {
  try {
    if (!id) throw new Error("Brand ID is required for delete");
    console.log("Delete brand API call:", id); // Debug log
    
    const response = await api.delete(BRAND_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    console.error("Delete brand error:", error);
    throw error;
  }
};

// Lấy danh sách tất cả brands
export const getAllBrands = async (params = {}) => {
  try {
    const response = await api.get(BRAND_ENDPOINTS.BASE, { params });
    return response;
  } catch (error) {
    console.error("Get all brands error:", error);
    throw error;
  }
};

// Tạo brand mới
export const createBrand = async (brandData) => {
  try {
    console.log("Create brand API call:", brandData); // Debug log

    const requestData = {
      name: brandData.name,
      description: brandData.description,
      status: brandData.status || 'active',
      ...(brandData.brandId && { brandId: brandData.brandId }),
    };

    // Remove undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(requestData).filter(([_, value]) => value !== undefined)
    );

    console.log("Cleaned data for create API:", cleanedData); // Debug log

    const response = await api.post(BRAND_ENDPOINTS.BASE, cleanedData);
    return response;
  } catch (error) {
    console.error(
      "Create brand error:",
      error.response?.data || error.message
    );
    throw error;
  }
};