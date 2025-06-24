import { useState, useEffect, useCallback, useRef } from "react";
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

  const [sortConfig, setSortConfig] = useState({
    field: "updatedAt",
    order: "desc",
  });

  const recentlyUpdatedRef = useRef(new Set());

  // Hàm sắp xếp dữ liệu với priority cho recently updated
  const sortData = useCallback(
    (data, sortField = "updatedAt", sortOrder = "desc") => {
      return [...data].sort((a, b) => {
        const aId = a.attrTypeId || a.id;
        const bId = b.attrTypeId || b.id;

        // Recently updated items always come first
        const aIsRecent = recentlyUpdatedRef.current.has(aId);
        const bIsRecent = recentlyUpdatedRef.current.has(bId);

        if (aIsRecent && !bIsRecent) return -1;
        if (!aIsRecent && bIsRecent) return 1;

        // Then sort by specified field
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Xử lý đặc biệt cho các trường khác nhau
        if (sortField === "createdAt" || sortField === "updatedAt") {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        } else if (sortField === "name") {
          aValue = (aValue || "").toLowerCase();
          bValue = (bValue || "").toLowerCase();
        } else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = (bValue || "").toLowerCase();
        }

        if (sortOrder === "desc") {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    },
    []
  );

  // Fetch attribute types
  const fetchAttributeTypes = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        const isFetchingAll = Object.keys(params).length === 0;

        if (isFetchingAll) {
          const cached = localStorage.getItem("attributeTypes");
          if (cached) {
            const cachedAttributeTypes = JSON.parse(cached);
            const sortedAttributeTypes = sortData(
              cachedAttributeTypes,
              sortConfig.field,
              sortConfig.order
            );
            setAttributeTypes(sortedAttributeTypes);
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
          updatedAt: attr_types.updatedAt || new Date().toISOString(),
          status: attr_types.status || "active",
        }));

        // Merge with localStorage to preserve recently updated items
        const existingData = JSON.parse(
          localStorage.getItem("attributeTypes") || "[]"
        );
        const mergedData = attributeTypesData.map((item) => {
          const existing = existingData.find(
            (e) => (e.attrTypeId || e.id) === (item.attrTypeId || item.id)
          );
          return existing ? { ...item, ...existing } : item;
        });

        // Apply filters to merged data
        let filteredData = mergedData;

        if (params.search) {
          const keywords = params.search
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .split(/\s+/);

          filteredData = filteredData.filter((attr_types) => {
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
          filteredData = filteredData.filter(
            (attr_types) => attr_types.status === params.status
          );
        }

        if (
          params.dateRange &&
          params.dateRange.start &&
          params.dateRange.end
        ) {
          filteredData = filteredData.filter((attr_types) => {
            if (!attr_types.createdAt) return false;
            const attr_typesDate = new Date(attr_types.createdAt);
            const startDate = new Date(params.dateRange.start);
            const endDate = new Date(params.dateRange.end);
            endDate.setHours(23, 59, 59, 999);
            return attr_typesDate >= startDate && attr_typesDate <= endDate;
          });
        }

        const sortedData = sortData(
          filteredData,
          sortConfig.field,
          sortConfig.order
        );

        setAttributeTypes(sortedData);
        setPagination((prev) => ({
          ...prev,
          total: sortedData.length,
        }));

        if (isFetchingAll) {
          localStorage.setItem("attributeTypes", JSON.stringify(sortedData));
        }
      } catch (error) {
        message.error("Lỗi khi tải danh sách loại thuộc tính");
        console.error("Error fetching attribute types:", error);
      } finally {
        setLoading(false);
      }
    },
    [sortData, sortConfig]
  );

  // Create attribute type
  const createAttributeType = async (attributeTypeData) => {
    try {
      const response = await createAttributeTypeAPI(attributeTypeData);

      let createdAttributeType;
      if (response && response.data) {
        createdAttributeType = response.data;
      } else {
        createdAttributeType = response;
      }

      const normalizedAttributeType = {
        ...createdAttributeType,
        attrTypeId: createdAttributeType.attrTypeId || createdAttributeType.id,
        id: createdAttributeType.attrTypeId || createdAttributeType.id,
        createdAt: createdAttributeType.createdAt || new Date().toISOString(),
        updatedAt: createdAttributeType.updatedAt || new Date().toISOString(),
      };

      message.success("Tạo loại thuộc tính thành công!");

      // Mark as recently updated
      const attrTypeId =
        normalizedAttributeType.attrTypeId || normalizedAttributeType.id;
      recentlyUpdatedRef.current.add(attrTypeId);

      setAttributeTypes((prev) => {
        const newList = [normalizedAttributeType, ...prev];
        const sortedList = sortData(
          newList,
          sortConfig.field,
          sortConfig.order
        );
        localStorage.setItem("attributeTypes", JSON.stringify(sortedList));
        return sortedList;
      });

      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return normalizedAttributeType;
    } catch (error) {
      console.error("Create attributeType error:", error);
      message.error("Lỗi khi tạo loại thuộc tính");
      throw error;
    }
  };

  // Update attribute type - Move to top after update
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

      // Find existing attribute type to preserve all data
      const existingAttributeType = attributeTypes.find(
        (at) => (at.attrTypeId || at.id) === attributeTypeId
      );

      // Create normalized updated item with preserved data
      const normalizedItem = {
        ...existingAttributeType, // Preserve existing data including createdAt
        ...attributeTypeData, // Apply updates
        attrTypeId: attributeTypeId,
        id: attributeTypeId,
        updatedAt: new Date().toISOString(),
      };

      // Mark as recently updated
      recentlyUpdatedRef.current.add(attributeTypeId);

      // Update attribute type and move to top
      setAttributeTypes((prevAttributeTypes) => {
        // Remove the updated item from current position
        const updatedList = prevAttributeTypes.filter(
          (attributeType) =>
            (attributeType.attrTypeId || attributeType.id) !== attributeTypeId
        );
        // Add updated item to the beginning
        const newList = [normalizedItem, ...updatedList];
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

      // Remove from recently updated
      recentlyUpdatedRef.current.delete(attributeTypeId);

      setAttributeTypes((prev) => {
        const filteredList = prev.filter(
          (attributeType) =>
            (attributeType.attrTypeId || attributeType.id) !== attributeTypeId
        );
        localStorage.setItem("attributeTypes", JSON.stringify(filteredList));
        return filteredList;
      });

      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error("Delete attribute type error:", error);
      message.error("Lỗi khi xóa loại thuộc tính");
      throw error;
    }
  };

  // Handle pagination change
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    if (sorter && sorter.field) {
      const newSortConfig = {
        field: sorter.field,
        order: sorter.order || "desc",
      };
      setSortConfig(newSortConfig);

      // Sắp xếp lại dữ liệu hiện tại
      setAttributeTypes((prev) =>
        sortData(prev, newSortConfig.field, newSortConfig.order)
      );
    }
  };

  // Clear recently updated after some time
  useEffect(() => {
    const interval = setInterval(() => {
      recentlyUpdatedRef.current.clear();
    }, 30000); // Clear after 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initial load
  useEffect(() => {
    fetchAttributeTypes();
  }, [fetchAttributeTypes]);

  return {
    attributeTypes,
    loading,
    pagination,
    sortConfig,
    fetchAttributeTypes,
    createAttributeType,
    updateAttributeType,
    deleteAttributeType,
    handleTableChange,
  };
};

export default useAttributeType;
