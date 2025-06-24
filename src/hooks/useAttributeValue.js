import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import {
  getAllAttributeValues,
  createAttributeValue as createAttributeValueAPI,
  updateAttributeValue as updateAttributeValueAPI,
  deleteAttributeValue as deleteAttributeValueAPI,
  getAttributeValuesByProduct,
} from "../services/attribute_values";
import { getAllProducts } from "../services/products";
import { getAllAttributeTypes } from "../services/attribute_types";

const useAttributeValue = () => {
  const [attributeValues, setAttributeValues] = useState([]);
  const [products, setProducts] = useState([]);
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} của ${total} giá trị thuộc tính`,
  });

  const isFetchingAllRef = useRef(false);

  const fetchAttributeValues = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const isFetchingAll = Object.keys(params).length === 0;
      isFetchingAllRef.current = isFetchingAll;

      // Kiểm tra localStorage nếu đang fetch tất cả
      if (isFetchingAll) {
        const cached = localStorage.getItem("attributeValues");
        if (cached) {
          const cachedData = JSON.parse(cached);
          setAttributeValues(cachedData);
          setPagination((prev) => ({
            ...prev,
            total: cachedData.length,
          }));
          setLoading(false);
          return;
        }
      }
      let data = [];

      try {
        const cachedData = localStorage.getItem("attributeValues");
        if (cachedData) {
          data = JSON.parse(cachedData);
        } else {
          console.warn("No cached data available, using empty array");
          data = [];
        }
      } catch (error) {
        console.error("Error loading attribute values:", error);
        data = [];
      }

      // Apply filters client-side
      let filteredData = [...data];

      // Apply search filter
      if (params.search) {
        filteredData = filteredData.filter((item) =>
          item.value?.toLowerCase().includes(params.search.toLowerCase())
        );
      }

      // Apply attr_type_id filter
      if (params.attr_type_id) {
        filteredData = filteredData.filter(
          (item) =>
            item.attr_type_id === params.attr_type_id ||
            item.attrTypeId === params.attr_type_id ||
            String(item.attr_type_id) === String(params.attr_type_id) ||
            String(item.attrTypeId) === String(params.attr_type_id)
        );
      }

      // Apply product_id filter
      if (params.product_id) {
        filteredData = filteredData.filter(
          (item) =>
            item.product_id === params.product_id ||
            item.productId === params.product_id ||
            String(item.product_id) === String(params.product_id) ||
            String(item.productId) === String(params.product_id)
        );
      }

      // Apply status filter
      if (params.status && params.status !== "all") {
        filteredData = filteredData.filter(
          (item) => item.status === params.status
        );
      }

      // Apply date range filter
      if (params.dateRange && params.dateRange.length === 2) {
        const [startDate, endDate] = params.dateRange;
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.created_at || item.createdAt);
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return itemDate >= start && itemDate <= end;
        });
      }

      // Normalize data structure
      const normalizedData = filteredData.map((item) => ({
        attr_value_id: item.attr_value_id || item.attrValueId || item.id,
        product_id: item.product_id || item.productId,
        attr_type_id: item.attr_type_id || item.attrTypeId,
        value: item.value,
        status: item.status || "active",
        created_at: item.created_at || item.createdAt,
        updated_at: item.updated_at || item.updatedAt,
      }));

      setAttributeValues(normalizedData);
      setPagination((prev) => ({
        ...prev,
        total: normalizedData.length,
      }));

      // Chỉ lưu vào localStorage nếu không có filter (để giữ nguyên data gốc)
      if (isFetchingAll && data.length > 0) {
        localStorage.setItem("attributeValues", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching attribute values:", error);
      message.error("Lỗi khi tải danh sách giá trị thuộc tính");
      // Set empty array if error
      setAttributeValues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products for dropdown
  const fetchProducts = useCallback(async () => {
    try {
      const response = await getAllProducts();
      console.log("Products response:", response);

      // Handle different API response structures
      let productsData = [];
      if (response && response.data) {
        productsData = Array.isArray(response.data)
          ? response.data
          : [response.data];
      } else if (Array.isArray(response)) {
        productsData = response;
      }

      // Filter active products only
      const activeProducts = productsData.filter(
        (product) =>
          product.active === true ||
          product.active === "true" ||
          product.status === "active" ||
          product.isActive === true
      );

      // Normalize product data
      const normalizedProducts = activeProducts.map((product) => ({
        id: product.id || product.productId,
        productId: product.id || product.productId,
        name: product.name,
        sku: product.sku,
        active: true,
      }));

      setProducts(normalizedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.warning("Không thể tải danh sách sản phẩm");
      setProducts([]);
    }
  }, []);

  // Fetch attribute types for dropdown
  const fetchAttributeTypes = useCallback(async () => {
    try {
      const response = await getAllAttributeTypes();
      console.log("Attribute types response:", response);

      // Handle different API response structures
      let typesData = [];
      if (response && response.data) {
        typesData = Array.isArray(response.data)
          ? response.data
          : [response.data];
      } else if (Array.isArray(response)) {
        typesData = response;
      }

      // Normalize attribute type data
      const normalizedTypes = typesData.map((type) => ({
        attr_type_id: type.attr_type_id || type.attrTypeId || type.id,
        name: type.name,
        description: type.description,
      }));

      setAttributeTypes(normalizedTypes);
    } catch (error) {
      console.error("Error fetching attribute types:", error);
      message.warning("Không thể tải danh sách loại thuộc tính");
      setAttributeTypes([]);
    }
  }, []);

  // Create attribute value
  const createAttributeValue = async (data) => {
    try {
      setLoading(true);
      console.log("Creating attribute value:", data);

      const response = await createAttributeValueAPI(data);
      console.log("Create response:", response);

      // Get the created item from response
      let createdItem;
      if (response && response.data) {
        createdItem = response.data;
      } else {
        createdItem = response;
      }

      // Normalize the created item
      const normalizedItem = {
        attr_value_id:
          createdItem.attr_value_id ||
          createdItem.attrValueId ||
          createdItem.id,
        product_id: data.product_id,
        attr_type_id: data.attr_type_id,
        value: data.value,
        status: data.status || "active",
        created_at:
          createdItem.created_at ||
          createdItem.createdAt ||
          new Date().toISOString(),
        updated_at:
          createdItem.updated_at ||
          createdItem.updatedAt ||
          new Date().toISOString(),
      };

      message.success("Tạo giá trị thuộc tính thành công!");

      // Add new item to the beginning of the list
      setAttributeValues((prev) => {
        const newList = [normalizedItem, ...prev];
        localStorage.setItem("attributeValues", JSON.stringify(newList));
        return newList;
      });

      return normalizedItem;
    } catch (error) {
      console.error("Create attribute value error:", error);
      message.error("Lỗi khi tạo giá trị thuộc tính");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update attribute value
  const updateAttributeValue = async (id, data) => {
    try {
      setLoading(true);
      console.log("Updating attribute value:", { id, data });

      const response = await updateAttributeValueAPI(id, data);
      console.log("Update response:", response);

      // Create a normalized item with the original ID to ensure consistency
      const normalizedItem = {
        attr_value_id: id,
        product_id: data.product_id,
        attr_type_id: data.attr_type_id,
        value: data.value,
        status: data.status,
        updated_at: new Date().toISOString(),
      };

      message.success("Cập nhật giá trị thuộc tính thành công!");

      // Update item in the list and move to the beginning
      setAttributeValues((prev) => {
        const updatedList = prev.filter(
          (item) => item.attr_value_id !== id && item.attrValueId !== id
        );
        const newList = [normalizedItem, ...updatedList];
        localStorage.setItem("attributeValues", JSON.stringify(newList));
        return newList;
      });

      return normalizedItem;
    } catch (error) {
      console.error("Update attribute value error:", error);
      message.error("Lỗi khi cập nhật giá trị thuộc tính");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete attribute value
  const deleteAttributeValue = async (id) => {
    try {
      setLoading(true);

      // Find the item to get its product_id
      const itemToDelete = attributeValues.find(
        (item) => item.attr_value_id === id || item.attrValueId === id
      );

      if (!itemToDelete || !itemToDelete.product_id) {
        throw new Error("Cannot find item or missing product_id");
      }

      await deleteAttributeValueAPI(id, itemToDelete.product_id);
      message.success("Xóa giá trị thuộc tính thành công!");

      // Remove deleted item from the list and update localStorage
      setAttributeValues((prev) => {
        const newList = prev.filter(
          (item) => item.attr_value_id !== id && item.attrValueId !== id
        );
        localStorage.setItem("attributeValues", JSON.stringify(newList));
        return newList;
      });
    } catch (error) {
      console.error("Delete attribute value error:", error);
      message.error("Lỗi khi xóa giá trị thuộc tính");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    const params = {
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
      sortBy: sorter.field,
      sortOrder: sorter.order,
    };
    fetchAttributeValues(params);
  };

  // Initial load
  useEffect(() => {
    fetchAttributeValues();
    fetchProducts();
    fetchAttributeTypes();
  }, [fetchAttributeValues, fetchProducts, fetchAttributeTypes]);

  return {
    attributeValues,
    products,
    attributeTypes,
    loading,
    pagination,
    fetchAttributeValues,
    createAttributeValue,
    updateAttributeValue,
    deleteAttributeValue,
    handleTableChange,
  };
};

export default useAttributeValue;
