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
    console.log('API call: getAllProducts with params:', params);
    
    // Chuẩn bị params cho API
    const apiParams = {};
    
    // Xử lý từng loại filter
    if (params.search) {
      apiParams.search = params.search;
    }
    
    if (params.categoryIds && params.categoryIds.length > 0) {
      apiParams.categoryIds = params.categoryIds.join(',');
    }
    
    if (params.brandIds && params.brandIds.length > 0) {
      apiParams.brandIds = params.brandIds.join(',');
    }
    
    if (params.minPrice !== undefined) {
      apiParams.minPrice = params.minPrice;
    }
    
    if (params.maxPrice !== undefined) {
      apiParams.maxPrice = params.maxPrice;
    }
    
    if (params.inStock !== undefined) {
      apiParams.inStock = params.inStock;
    }
    
    if (params.sortField) {
      apiParams.sortField = params.sortField;
    }
    
    if (params.sortOrder) {
      apiParams.sortOrder = params.sortOrder;
    }
    
    const response = await api.get('/products', { params: apiParams });
    return response;
  } catch (error) {
    console.error('Error getting all products:', error);
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    let filteredProducts = [...products];
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name?.toLowerCase().includes(searchLower) || 
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    if (params.categoryIds && params.categoryIds.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const categoryId = product.categoryId || (product.category && (product.category.id || product.category));
        return params.categoryIds.includes(categoryId);
      });
    }

    if (params.brandIds && params.brandIds.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const brandId = product.brandId || (product.brand && (product.brand.id || product.brand));
        return params.brandIds.includes(brandId);
      });
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.price || 0;
        if (params.minPrice !== undefined && price < params.minPrice) return false;
        if (params.maxPrice !== undefined && price > params.maxPrice) return false;
        return true;
      });
    }

    if (params.inStock) {
      filteredProducts = filteredProducts.filter(product => 
        (product.remainQuantity > 0 || product.stockQuantity > 0)
      );
    }

    if (params.sortField) {
      const sortField = params.sortField;
      const sortOrder = params.sortOrder || 'asc';
      
      filteredProducts.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (sortOrder === 'asc') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
        
        if (sortOrder === 'asc') {
          return (aValue || 0) - (bValue || 0);
        } else {
          return (bValue || 0) - (aValue || 0);
        }
      });
    }
    
    return { data: filteredProducts };
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
