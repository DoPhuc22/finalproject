import { useState, useEffect, useCallback } from "react";
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

  // Fetch all categories with filters
  const fetchCategories = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllCategories(params);
      const data = response.data || response;

      const categoriesWithCount = data.map((category) => ({
        ...category,
        createdAt: category.createdAt || new Date().toISOString(),
      }));
      setCategories(categoriesWithCount);
      setPagination((prev) => ({
        ...prev,
        total: categoriesWithCount.length,
      }));
    } catch (error) {
      message.error("Lỗi khi tải danh sách danh mục");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create category
  const createCategoryHandler = async (categoryData) => {
    try {
      console.log("Creating category:", categoryData); // Debug log
      const response = await createCategory(categoryData);
      message.success("Tạo danh mục thành công!");
      fetchCategories(); // Refresh list
      return response;
    } catch (error) {
      console.error("Create category error:", error);
      message.error("Lỗi khi tạo danh mục");
      throw error;
    }
  };

  // Update category
  const updateCategoryHandler = async (id, categoryData) => {
    try {
      console.log("Updating category:", { id, categoryData }); // Debug log

      // Đảm bảo ID là number hoặc string, không phải object
      const categoryId = typeof id === "object" ? id.categoryId || id.id : id;

      if (!categoryId) {
        throw new Error("Category ID is required for update");
      }

      const response = await updateCategory(categoryId, categoryData);
      message.success("Cập nhật danh mục thành công!");
      fetchCategories(); // Refresh list
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
      console.log("Deleting category:", id); // Debug log

      // Đảm bảo ID là number hoặc string, không phải object
      const categoryId = typeof id === "object" ? id.categoryId || id.id : id;

      if (!categoryId) {
        throw new Error("Category ID is required for delete");
      }

      await deleteCategory(categoryId);
      message.success("Xóa danh mục thành công!");
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Delete category error:", error);
      message.error("Lỗi khi xóa danh mục");
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
    fetchCategories(params);
  };

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    pagination,
    fetchCategories,
    createCategory: createCategoryHandler,
    updateCategory: updateCategoryHandler,
    deleteCategory: deleteCategoryHandler,
    handleTableChange,
  };
};

export default useCategory;
