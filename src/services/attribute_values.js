import api from "../utils/request";

// API endpoints cho attribute values - updated to use product-based endpoints
const ATTRIBUTE_ENDPOINTS = {
  // Product-specific attribute value endpoints
  BY_PRODUCT: (productId) => `/products/${productId}/attribute-values`,
  BY_PRODUCT_AND_ID: (productId, id) => `/products/${productId}/attribute-values/${id}`,
  ATTRIBUTES_BY_PRODUCT: (productId) => `/products/${productId}/attribute-values/attributes`,
  
  // Legacy endpoints (keeping for backward compatibility)
  BASE: "/attribute-values",
  BY_ID: (id) => `/attribute-values/${id}`,
};

// LocalStorage key for attribute values
const ATTRIBUTE_VALUES_STORAGE_KEY = "attribute_values_data";

// Helper functions for localStorage
const getAttributeValuesFromStorage = () => {
  try {
    const data = localStorage.getItem(ATTRIBUTE_VALUES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading attribute values from localStorage:", error);
    return [];
  }
};

const saveAttributeValuesToStorage = (attributeValues) => {
  try {
    localStorage.setItem(ATTRIBUTE_VALUES_STORAGE_KEY, JSON.stringify(attributeValues));
  } catch (error) {
    console.error("Error saving attribute values to localStorage:", error);
  }
};

const generateUniqueId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Lấy thông tin attribute value theo ID
export const getAttributeValueById = async (productId, id) => {
  try {
    const response = await api.get(ATTRIBUTE_ENDPOINTS.BY_PRODUCT_AND_ID(productId, id));
    return response;
  } catch (error) {
    console.error("Error fetching attribute value by ID:", error);
    
    // Fallback to localStorage
    const storedData = getAttributeValuesFromStorage();
    const found = storedData.find(item => 
      (item.attr_value_id === id || item.attrValueId === id) && 
      (item.product_id === productId || item.productId === productId)
    );
    
    if (found) {
      return { data: found };
    }
    
    throw error;
  }
};

// Cập nhật attribute value
export const updateAttributeValue = async (id, attributeData) => {
  try {
    // Ensure we have the necessary data
    if (!attributeData.product_id) {
      throw new Error("product_id is required for updating attribute value");
    }
    
    const productId = attributeData.product_id;
    
    // Adjust the payload format to match what the API expects
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
          'Content-Type': 'application/json',
        },
      }
    );

    // Update localStorage
    const storedData = getAttributeValuesFromStorage();
    const updatedData = storedData.map(item => {
      if ((item.attr_value_id === id || item.attrValueId === id) && 
          (item.product_id === productId || item.productId === productId)) {
        return {
          ...item,
          attr_type_id: attributeData.attr_type_id,
          value: attributeData.value,
          status: attributeData.status,
          updated_at: new Date().toISOString()
        };
      }
      return item;
    });
    saveAttributeValuesToStorage(updatedData);

    return response;
  } catch (error) {
    console.error("Update attribute value API error:", error);
    
    // Fallback to localStorage update
    const storedData = getAttributeValuesFromStorage();
    const updatedData = storedData.map(item => {
      if ((item.attr_value_id === id || item.attrValueId === id) && 
          (item.product_id === attributeData.product_id || item.productId === attributeData.product_id)) {
        return {
          ...item,
          attr_type_id: attributeData.attr_type_id,
          value: attributeData.value,
          status: attributeData.status,
          updated_at: new Date().toISOString()
        };
      }
      return item;
    });
    saveAttributeValuesToStorage(updatedData);
    
    return { data: updatedData.find(item => 
      (item.attr_value_id === id || item.attrValueId === id) && 
      (item.product_id === attributeData.product_id || item.productId === attributeData.product_id)
    )};
  }
};

// Xóa attribute value
export const deleteAttributeValue = async (id, productId) => {
  try {
    if (!productId) {
      throw new Error("productId is required for deleting attribute value");
    }
    
    const response = await api.delete(ATTRIBUTE_ENDPOINTS.BY_PRODUCT_AND_ID(productId, id));
    
    // Remove from localStorage
    const storedData = getAttributeValuesFromStorage();
    const filteredData = storedData.filter(item => 
      !((item.attr_value_id === id || item.attrValueId === id) && 
        (item.product_id === productId || item.productId === productId))
    );
    saveAttributeValuesToStorage(filteredData);
    
    return response;
  } catch (error) {
    console.error("Delete attribute value API error:", error);
    
    // Fallback to localStorage delete
    const storedData = getAttributeValuesFromStorage();
    const filteredData = storedData.filter(item => 
      !((item.attr_value_id === id || item.attrValueId === id) && 
        (item.product_id === productId || item.productId === productId))
    );
    saveAttributeValuesToStorage(filteredData);
    
    return { success: true };
  }
};

// Lấy danh sách tất cả attribute values theo productId
export const getAttributeValuesByProduct = async (productId, params = {}) => {
  try {
    const response = await api.get(ATTRIBUTE_ENDPOINTS.BY_PRODUCT(productId), { 
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Also update localStorage with API data
    if (response && response.data) {
      const apiData = Array.isArray(response.data) ? response.data : [response.data];
      const storedData = getAttributeValuesFromStorage();
      
      // Merge API data with stored data, API data takes precedence
      const mergedData = [...storedData];
      apiData.forEach(apiItem => {
        const existingIndex = mergedData.findIndex(stored => 
          (stored.attr_value_id === apiItem.attr_value_id || stored.attrValueId === apiItem.attrValueId) &&
          (stored.product_id === productId || stored.productId === productId)
        );
        
        if (existingIndex >= 0) {
          mergedData[existingIndex] = {
            ...mergedData[existingIndex],
            ...apiItem,
            product_id: productId
          };
        } else {
          mergedData.push({
            ...apiItem,
            product_id: productId
          });
        }
      });
      
      saveAttributeValuesToStorage(mergedData);
    }
    
    return response;
  } catch (error) {
    console.error("Get attribute values by product API error:", error);
    
    // Fallback to localStorage
    const storedData = getAttributeValuesFromStorage();
    const productData = storedData.filter(item => 
      item.product_id === productId || item.productId === productId
    );
    
    return { data: productData };
  }
};

// Lấy danh sách tất cả attribute values (lấy tổng hợp từ tất cả sản phẩm)
export const getAllAttributeValues = async (params = {}) => {
  try {
    // If we have a product_id, use the product-specific endpoint
    if (params.product_id) {
      return getAttributeValuesByProduct(params.product_id, params);
    }
    
    // Otherwise try to get from general endpoint
    const response = await api.get(ATTRIBUTE_ENDPOINTS.BASE, { 
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Update localStorage with API data
    if (response && response.data) {
      const apiData = Array.isArray(response.data) ? response.data : [response.data];
      saveAttributeValuesToStorage(apiData);
    }
    
    return response;
  } catch (error) {
    console.error("Get all attribute values API error:", error);
    
    // Fallback to localStorage
    const storedData = getAttributeValuesFromStorage();
    return { data: storedData };
  }
};

// Tạo attribute value mới
export const createAttributeValue = async (attributeData) => {
  try {
    if (!attributeData.product_id) {
      throw new Error("product_id is required for creating attribute value");
    }
    
    const productId = attributeData.product_id;
    
    // Adjust the payload format to match what the API expects
    const payload = {
      attrTypeId: attributeData.attr_type_id,
      value: attributeData.value,
      status: attributeData.status || 'active',
      productId: productId
    };

    console.log("Create attribute value payload:", payload);

    const response = await api.post(
      ATTRIBUTE_ENDPOINTS.BY_PRODUCT(productId), 
      payload, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Add to localStorage
    const newItem = {
      attr_value_id: response.data?.attr_value_id || response.data?.attrValueId || generateUniqueId(),
      product_id: productId,
      attr_type_id: attributeData.attr_type_id,
      value: attributeData.value,
      status: attributeData.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const storedData = getAttributeValuesFromStorage();
    const updatedData = [newItem, ...storedData];
    saveAttributeValuesToStorage(updatedData);

    return response;
  } catch (error) {
    console.error("Create attribute value API error:", error);
    
    // Fallback to localStorage creation
    const newItem = {
      attr_value_id: generateUniqueId(),
      product_id: attributeData.product_id,
      attr_type_id: attributeData.attr_type_id,
      value: attributeData.value,
      status: attributeData.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const storedData = getAttributeValuesFromStorage();
    const updatedData = [newItem, ...storedData];
    saveAttributeValuesToStorage(updatedData);
    
    return { data: newItem };
  }
};

// Lấy danh sách thuộc tính và giá trị theo sản phẩm
export const getAttributesAndValuesByProduct = async (productId) => {
  try {
    const response = await api.get(ATTRIBUTE_ENDPOINTS.ATTRIBUTES_BY_PRODUCT(productId));
    return response;
  } catch (error) {
    console.error("Get attributes and values by product API error:", error);
    
    // Fallback to localStorage
    const storedData = getAttributeValuesFromStorage();
    const productData = storedData.filter(item => 
      item.product_id === productId || item.productId === productId
    );
    
    return { data: productData };
  }
};

// Clear localStorage (for development/testing)
export const clearAttributeValuesStorage = () => {
  localStorage.removeItem(ATTRIBUTE_VALUES_STORAGE_KEY);
};
