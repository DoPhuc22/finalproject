import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../services/brands";

const useBrand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch all brands with filters
  const fetchBrands = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllBrands(params);
      const data = response.data || response;

      // Add product count for each brand (mock data)
      const brandsWithCount = data.map((brand) => ({
        ...brand,
        createdAt: brand.createdAt || new Date().toISOString(),
        status: brand.status || "active",
      }));

      setBrands(brandsWithCount);
      setPagination((prev) => ({
        ...prev,
        total: brandsWithCount.length,
      }));
    } catch (error) {
      message.error("Lỗi khi tải danh sách nhãn hàng");
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create brand
  const createBrandHandler = async (brandData) => {
    try {
      console.log("Creating brand:", brandData); // Debug log
      const response = await createBrand(brandData);
      message.success("Tạo nhãn hàng thành công!");
      fetchBrands(); // Refresh list
      return response;
    } catch (error) {
      console.error("Create brand error:", error);
      message.error("Lỗi khi tạo nhãn hàng");
      throw error;
    }
  };

  // Update brand
  const updateBrandHandler = async (id, brandData) => {
    try {
      console.log("Updating brand:", { id, brandData }); // Debug log

      // Đảm bảo ID là number hoặc string, không phải object
      const brandId = typeof id === "object" ? id.brandId || id.id : id;

      if (!brandId) {
        throw new Error("Brand ID is required for update");
      }

      const response = await updateBrand(brandId, brandData);
      message.success("Cập nhật nhãn hàng thành công!");
      fetchBrands(); // Refresh list
      return response;
    } catch (error) {
      console.error("Update brand error:", error);
      message.error("Lỗi khi cập nhật nhãn hàng");
      throw error;
    }
  };

  // Delete brand
  const deleteBrandHandler = async (id) => {
    try {
      console.log("Deleting brand:", id); // Debug log

      // Đảm bảo ID là number hoặc string, không phải object
      const brandId = typeof id === "object" ? id.brandId || id.id : id;

      if (!brandId) {
        throw new Error("Brand ID is required for delete");
      }

      await deleteBrand(brandId);
      message.success("Xóa nhãn hàng thành công!");
      fetchBrands(); // Refresh list
    } catch (error) {
      console.error("Delete brand error:", error);
      message.error("Lỗi khi xóa nhãn hàng");
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
    fetchBrands(params);
  };

  // Initial load
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    brands,
    loading,
    pagination,
    fetchBrands,
    createBrand: createBrandHandler,
    updateBrand: updateBrandHandler,
    deleteBrand: deleteBrandHandler,
    handleTableChange,
  };
};

export default useBrand;
