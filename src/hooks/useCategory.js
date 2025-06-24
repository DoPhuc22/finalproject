import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories";

const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sortConfig, setSortConfig] = useState({
    field: "updatedAt", // Thay đổi để ưu tiên item vừa edit
    order: "desc",
  });

  const recentlyUpdatedRef = useRef(new Set());

  // Hàm sắp xếp dữ liệu với priority cho recently updated
  const sortData = useCallback(
    (data, sortField = "updatedAt", sortOrder = "desc") => {
      return [...data].sort((a, b) => {
        const aId = a.categoryId || a.id;
        const bId = b.categoryId || b.id;

        // Recently updated items always come first
        const aIsRecent = recentlyUpdatedRef.current.has(aId);
        const bIsRecent = recentlyUpdatedRef.current.has(bId);

        if (aIsRecent && !bIsRecent) return -1;
        if (!aIsRecent && bIsRecent) return 1;

        // Then sort by specified field
        let aValue = a[sortField];
        let bValue = b[sortField];

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

  // Create category
  const createCategoryHandler = async (categoryData) => {
    try {
      const response = await createCategory(categoryData);
      let createdCategory;
      if (response && response.data) {
        createdCategory = response.data;
      } else {
        createdCategory = response;
      }
      const normalizedCategory = {
        ...createdCategory,
        categoryId: createdCategory.categoryId || createdCategory.id,
        id: createdCategory.categoryId || createdCategory.id,
        createdAt: createdCategory.createdAt || new Date().toISOString(),
        productCount: 0, // Category mới chưa có sản phẩm
      };

      message.success("Tạo danh mục thành công!");

      // Thêm category mới và sắp xếp lại toàn bộ danh sách
      setCategories((prev) => {
        const newList = [normalizedCategory, ...prev];
        const sortedList = sortData(
          newList,
          sortConfig.field,
          sortConfig.order
        );
        localStorage.setItem("categories", JSON.stringify(sortedList));
        return sortedList;
      });

      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));

      return normalizedCategory;
    } catch (error) {
      console.error("Create category error:", error);
      message.error("Lỗi khi tạo danh mục");
      throw error;
    }
  };

  // Update category - Move to top after update
  const updateCategoryHandler = async (id, categoryData) => {
    try {
      console.log("Updating category:", { id, categoryData });

      const categoryId = typeof id === "object" ? id.categoryId || id.id : id;

      if (!categoryId) {
        throw new Error("Category ID is required for update");
      }

      const response = await updateCategory(categoryId, categoryData);
      message.success("Cập nhật danh mục thành công!");

      // Find existing category to preserve all data
      const existingCategory = categories.find(
        (c) => (c.categoryId || c.id) === categoryId
      );

      // Create normalized updated item with preserved data
      const normalizedItem = {
        ...existingCategory, // Preserve existing data including createdAt
        ...categoryData, // Apply updates
        categoryId: categoryId,
        id: categoryId,
        updatedAt: new Date().toISOString(),
      };

      // Mark as recently updated
      recentlyUpdatedRef.current.add(categoryId);

      // Update category and move to top
      setCategories((prevCategories) => {
        // Remove the updated item from current position
        const updatedList = prevCategories.filter(
          (category) => (category.categoryId || category.id) !== categoryId
        );
        // Add updated item to the beginning
        const newList = [normalizedItem, ...updatedList];
        localStorage.setItem("categories", JSON.stringify(newList));
        return newList;
      });

      return response;
    } catch (error) {
      console.error("Update category error:", error);
      message.error("Lỗi khi cập nhật danh mục");
      throw error;
    }
  };

  // Delete category
  const deleteCategoryHandler = async (id) => {
    try {
      const categoryId = typeof id === "object" ? id.categoryId || id.id : id;
      if (!categoryId) throw new Error("Category ID required");

      await deleteCategory(categoryId);
      message.success("Xóa danh mục thành công!");

      // Xóa và cập nhật localStorage
      setCategories((prev) => {
        const filteredList = prev.filter(
          (category) => (category.categoryId || category.id) !== categoryId
        );
        localStorage.setItem("categories", JSON.stringify(filteredList));
        return filteredList;
      });

      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error("Delete category error:", error);
      message.error("Lỗi khi xóa danh mục");
      throw error;
    }
  };

  // Fetch all categories with filters - merge with localStorage
  const fetchCategories = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);

        const isFetchingAll = Object.keys(params).length === 0;

        if (isFetchingAll) {
          const cached = localStorage.getItem("categories");
          if (cached) {
            const cachedCategories = JSON.parse(cached);
            const sortedData = sortData(
              cachedCategories,
              sortConfig.field,
              sortConfig.order
            );
            setCategories(sortedData);
            setPagination((prev) => ({
              ...prev,
              total: sortedData.length,
            }));
            setLoading(false);
            return;
          }
        }

        const response = await getAllCategories(params);
        const data = response.data || response;

        let categoriesWithCount = data.map((category) => ({
          ...category,
          createdAt: category.createdAt || new Date().toISOString(),
          updatedAt: category.updatedAt || new Date().toISOString(),
          status: category.status || "active",
          productCount: Math.floor(Math.random() * 50) + 1,
        }));

        // Merge with localStorage to preserve recently updated items
        const existingData = JSON.parse(
          localStorage.getItem("categories") || "[]"
        );
        const mergedData = categoriesWithCount.map((item) => {
          const existing = existingData.find(
            (e) => (e.categoryId || e.id) === (item.categoryId || item.id)
          );
          return existing ? { ...item, ...existing } : item;
        });

        // Apply filters to merged data
        let filteredData = mergedData;

        // Filter by search keyword
        if (params.search) {
          const keywords = params.search
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .split(/\s+/);

          filteredData = filteredData.filter((category) => {
            const name =
              category.name
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") || "";
            const description = category.description?.toLowerCase() || "";
            const status = category.status?.toLowerCase() || "";

            return keywords.every(
              (word) =>
                name.includes(word) ||
                description.includes(word) ||
                status.includes(word)
            );
          });
        }

        // Filter by status
        if (params.status && params.status !== "all") {
          filteredData = filteredData.filter(
            (category) => category.status === params.status
          );
        }

        // Filter by date range
        if (
          params.dateRange &&
          params.dateRange.start &&
          params.dateRange.end
        ) {
          filteredData = filteredData.filter((category) => {
            if (!category.createdAt) return false;
            const createdAt = new Date(category.createdAt);
            const startDate = new Date(params.dateRange.start);
            const endDate = new Date(params.dateRange.end);
            endDate.setHours(23, 59, 59, 999);
            return createdAt >= startDate && createdAt <= endDate;
          });
        }

        const sortedData = sortData(
          filteredData,
          sortConfig.field,
          sortConfig.order
        );

        setCategories(sortedData);
        setPagination((prev) => ({
          ...prev,
          total: sortedData.length,
        }));

        if (isFetchingAll) {
          localStorage.setItem("categories", JSON.stringify(sortedData));
        }
      } catch (error) {
        message.error("Lỗi khi tải danh sách danh mục");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    },
    [sortData, sortConfig]
  );

  // Clear recently updated after some time
  useEffect(() => {
    const interval = setInterval(() => {
      recentlyUpdatedRef.current.clear();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle table pagination and sorting
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);

    // Cập nhật sortConfig nếu có thay đổi sorting
    if (sorter && sorter.field) {
      const newSortConfig = {
        field: sorter.field,
        order: sorter.order || "desc",
      };
      setSortConfig(newSortConfig);

      // Sắp xếp lại dữ liệu hiện tại
      setCategories((prev) =>
        sortData(prev, newSortConfig.field, newSortConfig.order)
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    pagination,
    sortConfig,
    fetchCategories,
    createCategory: createCategoryHandler,
    updateCategory: updateCategoryHandler,
    deleteCategory: deleteCategoryHandler,
    handleTableChange,
  };
};

export default useCategory;
