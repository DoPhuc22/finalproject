import api from "../utils/request";

// API endpoints cho products
const PRODUCT_ENDPOINTS = {
  BASE: "/products",
  BY_ID: (id) => `/products/${id}`,
  TAB_SEARCH: "/products/tab-search",
  CATEGORIES: "/products/categories",
  CATEGORIES_BY_ID: (id) => `/products/categories/${id}`,
  SOFT_DELETE: (id) => `/products/soft-delete/${id}`,
  BRANDS: "/products/brands",
  BRANDS_BY_ID: (id) => `/products/brands/${id}`,
  IMAGES: (productId) => `/products/${productId}/images`,
  IMAGES_BY_ID: (productId, imageId) =>
    `/products/${productId}/images/${imageId}`,
  ATTRIBUTE_VALUES: (productId) => `/products/${productId}/attribute-values`,
  ATTRIBUTE_VALUES_BY_ID: (productId, id) =>
    `/products/${productId}/attribute-values/${id}`,
  ATTRIBUTES: (productId) =>
    `/products/${productId}/attribute-values/attributes`,
};

// === PRODUCT CRUD ===
export const getProductById = async (id) => {
  try {
    const response = await api.get(PRODUCT_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(PRODUCT_ENDPOINTS.BY_ID(id), productData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(PRODUCT_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get(PRODUCT_ENDPOINTS.BASE, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post(PRODUCT_ENDPOINTS.BASE, productData);
    return response;
  } catch (error) {
    throw error;
  }
};

// === PRODUCT SEARCH ===
export const searchProductsAdvanced = async (searchCriteria) => {
  try {
    const response = await api.post(PRODUCT_ENDPOINTS.TAB_SEARCH, {
      minPrice: searchCriteria.minPrice,
      maxPrice: searchCriteria.maxPrice,
      brandIds: searchCriteria.brandIds,
      categoryIds: searchCriteria.categoryIds,
      attributes: searchCriteria.attributes,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// === PRODUCT BY CATEGORY ===
export const getProductCategories = async (params = {}) => {
  try {
    const response = await api.get(PRODUCT_ENDPOINTS.CATEGORIES, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await api.get(
      PRODUCT_ENDPOINTS.CATEGORIES_BY_ID(categoryId),
      { params }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// === PRODUCT BY BRAND ===
export const getProductBrands = async (params = {}) => {
  try {
    const response = await api.get(PRODUCT_ENDPOINTS.BRANDS, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductsByBrand = async (brandId, params = {}) => {
  try {
    const response = await api.get(PRODUCT_ENDPOINTS.BRANDS_BY_ID(brandId), {
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// === PRODUCT IMAGES ===
export const getProductImage = async (productId, imageId) => {
  try {
    const response = await api.get(
      PRODUCT_ENDPOINTS.IMAGES_BY_ID(productId, imageId)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProductImage = async (productId, imageId, imageData) => {
  try {
    const response = await api.put(
      PRODUCT_ENDPOINTS.IMAGES_BY_ID(productId, imageId),
      {
        imageId: imageData.imageId,
        productId: imageData.productId,
        imageUrl: imageData.imageUrl,
        isPrimary: imageData.isPrimary,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteProductImage = async (productId, imageId) => {
  try {
    const response = await api.delete(
      PRODUCT_ENDPOINTS.IMAGES_BY_ID(productId, imageId)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductImages = async (productId) => {
  try {
    const response = await api.get(PRODUCT_ENDPOINTS.IMAGES(productId));
    return response;
  } catch (error) {
    throw error;
  }
};

export const addProductImage = async (productId, imageData) => {
  try {
    const response = await api.post(PRODUCT_ENDPOINTS.IMAGES(productId), {
      imageId: imageData.imageId,
      productId: imageData.productId,
      imageUrl: imageData.imageUrl,
      isPrimary: imageData.isPrimary,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// === PRODUCT ATTRIBUTE VALUES ===
export const getProductAttributeValue = async (productId, id) => {
  try {
    const response = await api.get(
      PRODUCT_ENDPOINTS.ATTRIBUTE_VALUES_BY_ID(productId, id)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProductAttributeValue = async (
  productId,
  id,
  attributeData
) => {
  try {
    const response = await api.put(
      PRODUCT_ENDPOINTS.ATTRIBUTE_VALUES_BY_ID(productId, id),
      {
        attrValueId: attributeData.attrValueId,
        productId: attributeData.productId,
        attrTypeId: attributeData.attrTypeId,
        value: attributeData.value,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa attribute value (hard delete)
export const deleteProductAttributeValue = async (productId, id) => {
  try {
    const response = await api.delete(PRODUCT_ENDPOINTS.ATTRIBUTE_VALUE_BY_ID(productId, id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa mềm attribute value (soft delete)
export const softDeleteProductAttributeValue = async (productId, id) => {
  try {
    const response = await api.delete(PRODUCT_ENDPOINTS.ATTRIBUTE_VALUE_SOFT_DELETE(productId, id));
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductAttributeValues = async (productId) => {
  try {
    const response = await api.get(
      PRODUCT_ENDPOINTS.ATTRIBUTE_VALUES(productId)
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addProductAttributeValue = async (productId, attributeData) => {
  try {
    const response = await api.post(
      PRODUCT_ENDPOINTS.ATTRIBUTE_VALUES(productId),
      {
        attrValueId: attributeData.attrValueId,
        productId: attributeData.productId,
        attrTypeId: attributeData.attrTypeId,
        value: attributeData.value,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductAttributes = async (productId) => {
  try {
    const response = await api.get(PRODUCT_ENDPOINTS.ATTRIBUTES(productId));
    return response;
  } catch (error) {
    throw error;
  }
};
