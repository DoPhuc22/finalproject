import { useState, useEffect, useCallback, useRef } from "react";
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

  const [sortConfig, setSortConfig] = useState({
    field: "updatedAt", // Thay đổi để ưu tiên item vừa edit
    order: "desc",
  });

  const recentlyUpdatedRef = useRef(new Set());

  // Hàm sắp xếp dữ liệu với priority cho recently updated
  const sortData = useCallback(
    (data, sortField = "updatedAt", sortOrder = "desc") => {
      return [...data].sort((a, b) => {
        const aId = a.brandId || a.id;
        const bId = b.brandId || b.id;

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

  // Fetch all brands with filters
  const fetchBrands = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        const isFetchingAll = Object.keys(params).length === 0;
        
        if (isFetchingAll) {
          const cached = localStorage.getItem("brands");
          if (cached) {
            const cachedBrands = JSON.parse(cached);
            const sortedBrands = sortData(
              cachedBrands,
              sortConfig.field,
              sortConfig.order
            );
            setBrands(sortedBrands);
            setPagination((prev) => ({
              ...prev,
              total: cachedBrands.length,
            }));
            setLoading(false);
            return;
          }
        }

        const response = await getAllBrands(params);
        const data = response.data || response;

        // Normalize data with proper date handling
        let brandsWithCount = data.map((brand) => ({
          ...brand,
          createdAt: brand.createdAt || new Date().toISOString(),
          updatedAt: brand.updatedAt || new Date().toISOString(),
          status: brand.status || "active",
        }));

        // Merge with localStorage to preserve recently updated items
        const existingData = JSON.parse(localStorage.getItem("brands") || "[]");
        const mergedData = brandsWithCount.map(item => {
          const existing = existingData.find(e => (e.brandId || e.id) === (item.brandId || item.id));
          return existing ? { ...item, ...existing } : item;
        });

        // Apply filters to merged data
        let filteredData = mergedData;

        // Client-side filtering
        if (params.search) {
          const keywords = params.search
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .split(/\s+/);

          filteredData = filteredData.filter((brand) => {
            const name =
              brand.name
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
          filteredData = filteredData.filter(
            (brand) => brand.status === params.status
          );
        }

        if (
          params.dateRange &&
          params.dateRange.start &&
          params.dateRange.end
        ) {
          filteredData = filteredData.filter((brand) => {
            if (!brand.createdAt) return false;
            const brandDate = new Date(brand.createdAt);
            const startDate = new Date(params.dateRange.start);
            const endDate = new Date(params.dateRange.end);
            endDate.setHours(23, 59, 59, 999);
            return brandDate >= startDate && brandDate <= endDate;
          });
        }

        const sortedData = sortData(
          filteredData,
          sortConfig.field,
          sortConfig.order
        );

        setBrands(sortedData);
        setPagination((prev) => ({
          ...prev,
          total: sortedData.length,
        }));

        if (isFetchingAll) {
          localStorage.setItem("brands", JSON.stringify(sortedData));
        }
      } catch (error) {
        message.error("Lỗi khi tải danh sách nhãn hàng");
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    },
    [sortData, sortConfig]
  );

  // Create brand - REFETCH AFTER SUCCESS
  const createBrandHandler = async (brandData) => {
    try {
      const response = await createBrand(brandData);

      let createdBrand;
      if (response && response.data) {
        createdBrand = response.data;
      } else {
        createdBrand = response;
      }

      const normalizedBrand = {
        ...createdBrand,
        brandId: createdBrand.brandId || createdBrand.id,
        id: createdBrand.brandId || createdBrand.id,
        createdAt: createdBrand.createdAt || new Date().toISOString(),
        updatedAt: createdBrand.updatedAt || new Date().toISOString(),
      };

      message.success("Tạo nhãn hàng thành công!");
      
      // Mark as recently updated
      const brandId = normalizedBrand.brandId || normalizedBrand.id;
      recentlyUpdatedRef.current.add(brandId);
      
      setBrands((prev) => {
        const newList = [normalizedBrand, ...prev];
        const sortedList = sortData(
          newList,
          sortConfig.field,
          sortConfig.order
        );
        localStorage.setItem("brands", JSON.stringify(sortedList));
        return sortedList;
      });

      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return normalizedBrand;
    } catch (error) {
      console.error("Create brand error:", error);
      message.error("Lỗi khi tạo nhãn hàng");
      throw error;
    }
  };

  // Update brand - Move to top after update
  const updateBrandHandler = async (id, brandData) => {
    try {
      console.log("Updating brand:", { id, brandData });

      const brandId = typeof id === "object" ? id.brandId || id.id : id;

      if (!brandId) {
        throw new Error("Brand ID is required for update");
      }

      const response = await updateBrand(brandId, brandData);
      message.success("Cập nhật nhãn hàng thành công!");

      // Find existing brand to preserve all data
      const existingBrand = brands.find(b => 
        (b.brandId || b.id) === brandId
      );

      // Create normalized updated item with preserved data
      const normalizedItem = {
        ...existingBrand, // Preserve existing data including createdAt
        ...brandData, // Apply updates
        brandId: brandId,
        id: brandId,
        updatedAt: new Date().toISOString(),
      };

      // Mark as recently updated
      recentlyUpdatedRef.current.add(brandId);

      // Update brand and move to top
      setBrands((prevBrands) => {
        // Remove the updated item from current position
        const updatedList = prevBrands.filter(
          (brand) => (brand.brandId || brand.id) !== brandId
        );
        // Add updated item to the beginning
        const newList = [normalizedItem, ...updatedList];
        localStorage.setItem("brands", JSON.stringify(newList));
        return newList;
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
      
      // Remove from recently updated
      recentlyUpdatedRef.current.delete(brandId);
      
      setBrands((prev) => {
        const filteredList = prev.filter(
          (brand) => (brand.brandId || brand.id) !== brandId
        );
        localStorage.setItem("brands", JSON.stringify(filteredList));
        return filteredList;
      });

      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error("Delete brand error:", error);
      message.error("Lỗi khi xóa nhãn hàng");
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
      setBrands((prev) =>
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
    fetchBrands();
  }, [fetchBrands]);

  return {
    brands,
    loading,
    pagination,
    sortConfig,
    fetchBrands,
    createBrand: createBrandHandler,
    updateBrand: updateBrandHandler,
    deleteBrand: deleteBrandHandler,
    handleTableChange,
  };
};

export default useBrand;