import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import {
  getAllAttributeTypes,
  createAttributeType as createAttributeTypeAPI,
  updateAttributeType as updateAttributeTypeAPI,
  deleteAttributeType as deleteAttributeTypeAPI,
} from "../services/attribute_types";

const useAttributeType = () => {
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} của ${total} loại thuộc tính`,
  });

  // Fetch attribute types
  const fetchAttributeTypes = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      if (Object.keys(params).length === 0) {
        const cached = localStorage.getItem("attributeTypes");
        if (cached) {
          const cachedAttributeTypes = JSON.parse(cached);
          setAttributeTypes(cachedAttributeTypes);
          setPagination((prev) => ({
            ...prev,
            total: cachedAttributeTypes.length,
          }));
          setLoading(false);
          return;
        }
      }
      const response = await getAllAttributeTypes();
      const data = response.data || response;

      let attributeTypesData = data.map((attr_types) => ({
        ...attr_types,
        createdAt: attr_types.createdAt || new Date().toISOString(),
        status: attr_types.status || "active",
      }));

      if (params.search) {
        const searchLower = params.search.toLowerCase();
        const keywords = params.search
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split(/\s+/);

        attributeTypesData = attributeTypesData.filter((attr_types) => {
          const name =
            attr_types.name
              ?.toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") || "";
          const status = attr_types.status?.toLowerCase() || "";

          return keywords.every(
            (word) => name.includes(word) || status.includes(word)
          );
        });
      }

      if (params.status && params.status !== "all") {
        attributeTypesData = attributeTypesData.filter(
          (attr_types) => attr_types.status === params.status
        );
      }

      if (params.dateRange && params.dateRange.start && params.dateRange.end) {
        attributeTypesData = attributeTypesData.filter((attr_types) => {
          if (!attr_types.createdAt) return false;
          const attr_typesDate = new Date(attr_types.createdAt);
          const startDate = new Date(params.dateRange.start);
          const endDate = new Date(params.dateRange.end);
          endDate.setHours(23, 59, 59, 999);
          return attr_typesDate >= startDate && attr_typesDate <= endDate;
        });
      }

      setAttributeTypes(attributeTypesData);
      setPagination((prev) => ({
        ...prev,
        total: attributeTypesData.length,
      }));

      if (Object.keys(params).length === 0) {
        localStorage.setItem(
          "attributeTypes",
          JSON.stringify(attributeTypesData)
        );
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách loại thuộc tính");
      console.error("Error fetching attribute types:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create attribute type
  const createAttributeType = async (attributeTypeData) => {
    try {
      console.log("Creating attribute type:", attributeTypeData);
      const response = await createAttributeTypeAPI(attributeTypeData);
      message.success("Tạo loại thuộc tính thành công!");
      fetchAttributeTypes(); // Refresh list
      return response;
    } catch (error) {
      console.error("Create attribute type error:", error);
      message.error("Lỗi khi tạo loại thuộc tính");
      throw error;
    }
  };

  // Update attribute type
  const updateAttributeType = async (id, attributeTypeData) => {
    try {
      console.log("Updating attribute type:", { id, attributeTypeData });

      const attributeTypeId =
        typeof id === "object" ? id.attrTypeId || id.id : id;

      if (!attributeTypeId) {
        throw new Error("ID loại thuộc tính không hợp lệ");
      }

      const response = await updateAttributeTypeAPI(
        attributeTypeId,
        attributeTypeData
      );
      message.success("Cập nhật loại thuộc tính thành công!");

      // Cập nhật attribute type trong danh sách và đưa lên đầu
      setAttributeTypes((prevTypes) => {
        const updatedTypes = prevTypes.filter(
          (type) => (type.attrTypeId || type.id) !== attributeTypeId
        );

        // Ưu tiên lấy dữ liệu mới nhất từ response nếu có
        const updatedType = {
          ...prevTypes.find(
            (type) => (type.attrTypeId || type.id) === attributeTypeId
          ),
          ...(response.data || response),
          attrTypeId: attributeTypeId,
          id: attributeTypeId,
          createdAt:
            prevTypes.find(
              (type) => (type.attrTypeId || type.id) === attributeTypeId
            )?.createdAt || new Date().toISOString(),
        };

        const newList = [updatedType, ...updatedTypes];
        localStorage.setItem("attributeTypes", JSON.stringify(newList));
        return newList;
      });

      return response;
    } catch (error) {
      console.error("Update attribute type error:", error);
      message.error("Lỗi khi cập nhật loại thuộc tính");
      throw error;
    }
  };

  // Delete attribute type
  const deleteAttributeType = async (id) => {
    try {
      const attributeTypeId =
        typeof id === "object" ? id.attrTypeId || id.id : id;
      await deleteAttributeTypeAPI(attributeTypeId);
      message.success("Xóa loại thuộc tính thành công!");
      fetchAttributeTypes(); // Refresh list
    } catch (error) {
      console.error("Delete attribute type error:", error);
      message.error("Lỗi khi xóa loại thuộc tính");
      throw error;
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
    fetchAttributeTypes(params);
  };

  // Initial load
  useEffect(() => {
    fetchAttributeTypes();
  }, [fetchAttributeTypes]);

  return {
    attributeTypes,
    loading,
    pagination,
    fetchAttributeTypes,
    createAttributeType,
    updateAttributeType,
    deleteAttributeType,
    handleTableChange,
  };
};

export default useAttributeType;
