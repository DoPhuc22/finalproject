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
      if (Object.keys(params).length === 0) {
        const cached = localStorage.getItem("categories");
        if (cached) {
          const cachedCategories = JSON.parse(cached);
          setCategories(cachedCategories);
          setPagination((prev) => ({
            ...prev,
            total: cachedCategories.length,
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
        status: category.status || "active",
        productCount: Math.floor(Math.random() * 50) + 1, // mô phỏng
      }));

      // Filter by search keyword
      if (params.search) {
        const keywords = params.search
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split(/\s+/);

        categoriesWithCount = categoriesWithCount.filter((category) => {
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
        categoriesWithCount = categoriesWithCount.filter(
          (category) => category.status === params.status
        );
      }

      // Filter by date range
      if (params.dateRange && params.dateRange.start && params.dateRange.end) {
        categoriesWithCount = categoriesWithCount.filter((category) => {
          if (!category.createdAt) return false;
          const createdAt = new Date(category.createdAt);
          const startDate = new Date(params.dateRange.start);
          const endDate = new Date(params.dateRange.end);
          endDate.setHours(23, 59, 59, 999);
          return createdAt >= startDate && createdAt <= endDate;
        });
      }

      setCategories(categoriesWithCount);
      setPagination((prev) => ({
        ...prev,
        total: categoriesWithCount.length,
      }));
      if (Object.keys(params).length === 0) {
        localStorage.setItem("categories", JSON.stringify(categoriesWithCount));
      }
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
      const response = await createCategory(categoryData);
      message.success("Tạo danh mục thành công!");
      localStorage.removeItem("categories");
      fetchCategories();
      return response;
    } catch (error) {
      console.error("Create category error:", error);
      message.error("Lỗi khi tạo danh mục");
      throw error;
    }
  };

  // Update category (and move to top)
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
    
          // Cập nhật category trong danh sách và đưa lên đầu
          setCategories((prevCategories) => {
            const updatedCategories = prevCategories.filter(
              (category) => (category.categoryId || category.id) !== categoryId
            );
    
            // Tạo category đã cập nhật với dữ liệu mới
            const updatedcategory = {
              ...prevCategories.find(
                (category) => (category.categoryId || category.id) === categoryId
              ),
              ...categoryData,
              categoryId: categoryId,
              id: categoryId,
              joinDate:
                prevCategories.find(
                  (category) => (category.categoryId || category.id) === categoryId
                )?.joinDate || new Date().toISOString(),
            };
    
            // Đưa category đã cập nhật lên đầu danh sách
            const newList = [updatedcategory, ...updatedCategories];
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
      await fetchCategories();
    } catch (error) {
      console.error("Delete category error:", error);
      message.error("Lỗi khi xóa danh mục");
      throw error;
    }
  };

  // Handle table pagination
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    fetchCategories({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
      sortBy: sorter.field,
      sortOrder: sorter.order,
    });
  };

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
