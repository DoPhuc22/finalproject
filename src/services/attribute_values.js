import api from "../utils/request";

// API endpoints cho attribute values - chỉ sử dụng product-based endpoints
const ATTRIBUTE_ENDPOINTS = {
  // Product-specific attribute value endpoints
  BY_PRODUCT: (productId) => `/products/${productId}/attribute-values`,
  BY_PRODUCT_AND_ID: (productId, id) =>
    `/products/${productId}/attribute-values/${id}`,
  ATTRIBUTES_BY_PRODUCT: (productId) =>
    `/products/${productId}/attribute-values/attributes`,
};

// Lấy thông tin attribute value theo ID
export const getAttributeValueById = async (productId, id) => {
  try {
    const response = await api.get(
      ATTRIBUTE_ENDPOINTS.BY_PRODUCT_AND_ID(productId, id)
    );
    return response;
  } catch (error) {
    console.error("Error fetching attribute value by ID:", error);
    throw error;
  }
};

// Cập nhật attribute value
export const updateAttributeValue = async (id, attributeData) => {
  try {
    if (!attributeData.product_id) {
      throw new Error("product_id is required for updating attribute value");
    }

    const productId = attributeData.product_id;

    const payload = {
      attrValueId: id,
      productId: productId,
      attrTypeId: attributeData.attr_type_id,
      value: attributeData.value,
      status: attributeData.status,
    };

    console.log("Update attribute value payload:", payload);

    const response = await api.put(
      ATTRIBUTE_ENDPOINTS.BY_PRODUCT_AND_ID(productId, id),
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Update attribute value API error:", error);
    throw error;
  }
};

// Xóa attribute value
export const deleteAttributeValue = async (id, productId) => {
  try {
    if (!productId) {
      throw new Error("productId is required for deleting attribute value");
    }

    const response = await api.delete(
      ATTRIBUTE_ENDPOINTS.BY_PRODUCT_AND_ID(productId, id)
    );
    return response;
  } catch (error) {
    console.error("Delete attribute value API error:", error);
    throw error;
  }
};

// Lấy danh sách attribute values theo productId
export const getAttributeValuesByProduct = async (productId, params = {}) => {
  try {
    const response = await api.get(ATTRIBUTE_ENDPOINTS.BY_PRODUCT(productId), {
      params,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Get attribute values by product API error:", error);
    throw error;
  }
};

// Thay thế getAllAttributeValues - không gọi API mà chỉ return empty data
// vì endpoint này không tồn tại
export const getAllAttributeValues = async (params = {}) => {
  console.warn(
    "getAllAttributeValues: API endpoint not available, using localStorage only"
  );

  // Trả về empty data để useAttributeValue hook xử lý từ localStorage
  return { data: [] };
};

// Tạo attribute value mới
export const createAttributeValue = async (attributeData) => {
  try {
    if (!attributeData.product_id) {
      throw new Error("product_id is required for creating attribute value");
    }

    const productId = attributeData.product_id;

    const payload = {
      attrTypeId: attributeData.attr_type_id,
      value: attributeData.value,
      status: attributeData.status || "active",
      productId: productId,
    };

    console.log("Create attribute value payload:", payload);

    const response = await api.post(
      ATTRIBUTE_ENDPOINTS.BY_PRODUCT(productId),
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Create attribute value API error:", error);
    throw error;
  }
};

// Lấy danh sách thuộc tính và giá trị theo sản phẩm
export const getAttributesAndValuesByProduct = async (productId) => {
  try {
    const response = await api.get(
      ATTRIBUTE_ENDPOINTS.ATTRIBUTES_BY_PRODUCT(productId)
    );
    return response;
  } catch (error) {
    console.error("Get attributes and values by product API error:", error);
    throw error;
  }
};
