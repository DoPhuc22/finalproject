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
      let brandsWithCount = data.map((brand) => ({
        ...brand,
        createdAt: brand.createdAt || new Date().toISOString(),
        status: brand.status || "active",
        productCount: Math.floor(Math.random() * 50) + 1,
      }));

      // Client-side filtering
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        const keywords = params.search
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split(/\s+/);

        brandsWithCount = brandsWithCount.filter((brand) => {
          const name = brand.name
            ?.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") || "";
          const description = brand.description?.toLowerCase() || "";
          const status = brand.status?.toLowerCase() || "";

          return keywords.every(
            (word) =>
              name.includes(word) ||
              description.includes(word) ||
              status.includes(word)
          );
        });
      }

      if (params.status && params.status !== "all") {
        brandsWithCount = brandsWithCount.filter(
          (brand) => brand.status === params.status
        );
      }

      if (params.dateRange && params.dateRange.start && params.dateRange.end) {
        brandsWithCount = brandsWithCount.filter((brand) => {
          if (!brand.createdAt) return false;
          const brandDate = new Date(brand.createdAt);
          const startDate = new Date(params.dateRange.start);
          const endDate = new Date(params.dateRange.end);
          endDate.setHours(23,59,59,999);
          return brandDate >= startDate && brandDate <= endDate;
        });
      }

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

  // Create brand - REFETCH AFTER SUCCESS
  const createBrandHandler = async (brandData) => {
    try {
      const response = await createBrand(brandData);
      message.success("Tạo nhãn hàng thành công!");
      
      // Refetch to ensure data consistency
      await fetchBrands();
      
      return response;
    } catch (error) {
      console.error("Create brand error:", error);
      message.error("Lỗi khi tạo nhãn hàng");
      throw error;
    }
  };

  // Update brand - REFETCH AND MOVE TO TOP
  const updateBrandHandler = async (id, brandData) => {
    try {
      // Ensure ID is number/string
      const brandId = typeof id === "object" ? id.brandId || id.id : id;
      if (!brandId) throw new Error("Brand ID required");

      const response = await updateBrand(brandId, brandData);
      message.success("Cập nhật nhãn hàng thành công!");

      // Refetch data first to get latest changes
      fetchBrands();
      
      // Then move updated item to top
      setBrands(prev => {
        // Find updated brand
        const updatedBrand = prev.find(
          b => (b.brandId || b.id) === brandId
        );
        
        if (!updatedBrand) return prev;
        
        // Filter out the updated brand
        const otherBrands = prev.filter(
          b => (b.brandId || b.id) !== brandId
        );
        
        // Place updated brand at top
        return [updatedBrand, ...otherBrands];
      });

      return response;
    } catch (error) {
      console.error("Update brand error:", error);
      message.error("Lỗi khi cập nhật nhãn hàng");
      throw error;
    }
  };

  // Delete brand - REFETCH AFTER SUCCESS
  const deleteBrandHandler = async (id) => {
    try {
      const brandId = typeof id === "object" ? id.brandId || id.id : id;
      if (!brandId) throw new Error("Brand ID required");

      await deleteBrand(brandId);
      message.success("Xóa nhãn hàng thành công!");
      
      // Refetch to ensure data consistency
      await fetchBrands();
    } catch (error) {
      console.error("Delete brand error:", error);
      message.error("Lỗi khi xóa nhãn hàng");
      throw error;
    }
  };

  // Handle pagination change
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    fetchBrands({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
      sortBy: sorter.field,
      sortOrder: sorter.order,
    });
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