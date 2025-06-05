import api from "../utils/request";

// API endpoints cho categories
const CATEGORY_ENDPOINTS = {
  BASE: "/categories",
  BY_ID: (id) => `/categories/${id}`,
};

// Lấy thông tin category theo ID
export const getCategoryById = async (id) => {
  try {
    if (!id) throw new Error("Category ID is required");
    const response = await api.get(CATEGORY_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    console.error("Get category by ID error:", error);
    throw error;
  }
};

// Cập nhật category
export const updateCategory = async (id, categoryData) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error("Category ID is required for update");
    }

    console.log("Update category API call:", { id, categoryData }); // Debug log

    const requestData = {
      categoryId: categoryData.categoryId || id,
      name: categoryData.name,
      description: categoryData.description,
      ...(categoryData.color && { color: categoryData.color }),
    };

    // Remove undefined values to avoid sending null/undefined to API
    const cleanedData = Object.fromEntries(
      Object.entries(requestData).filter(([_, value]) => value !== undefined)
    );

    console.log("Cleaned data for API:", cleanedData); // Debug log

    const response = await api.put(CATEGORY_ENDPOINTS.BY_ID(id), cleanedData);
    return response;
  } catch (error) {
    console.error(
      "Update category error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa category
export const deleteCategory = async (id) => {
  try {
    if (!id) throw new Error("Category ID is required for delete");
    console.log("Delete category API call:", id); // Debug log

    const response = await api.delete(CATEGORY_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    console.error("Delete category error:", error);
    throw error;
  }
};

// Lấy danh sách tất cả categories
export const getAllCategories = async (params = {}) => {
  try {
    const response = await api.get(CATEGORY_ENDPOINTS.BASE, { params });
    return response;
  } catch (error) {
    console.error("Get all categories error:", error);
    throw error;
  }
};

// Tạo category mới
export const createCategory = async (categoryData) => {
  try {
    console.log("Create category API call:", categoryData); // Debug log

    const requestData = {
      name: categoryData.name,
      description: categoryData.description,
      ...(categoryData.color && { color: categoryData.color }),
      ...(categoryData.categoryId && { categoryId: categoryData.categoryId }),
    };

    // Remove undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(requestData).filter(([_, value]) => value !== undefined)
    );

    console.log("Cleaned data for create API:", cleanedData); // Debug log

    const response = await api.post(CATEGORY_ENDPOINTS.BASE, cleanedData);
    return response;
  } catch (error) {
    console.error(
      "Create category error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
