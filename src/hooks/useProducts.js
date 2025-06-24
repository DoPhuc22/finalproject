import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImages,
  addProductImage,
  deleteProductImage,
} from "../services/products";
import { getAllCategories } from "../services/categories";
import { getAllBrands } from "../services/brands";
import axios from "axios";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} của ${total} sản phẩm`,
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
        const aId = a.productId || a.id;
        const bId = b.productId || b.id;

        // Recently updated items always come first
        const aIsRecent = recentlyUpdatedRef.current.has(aId);
        const bIsRecent = recentlyUpdatedRef.current.has(bId);

        if (aIsRecent && !bIsRecent) return -1;
        if (!aIsRecent && bIsRecent) return 1;

        // Then sort by specified field
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (
          sortField === "createdAt" ||
          sortField === "updatedAt" ||
          sortField === "joinDate"
        ) {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        } else if (sortField === "name" || sortField === "title") {
          aValue = (aValue || "").toLowerCase();
          bValue = (bValue || "").toLowerCase();
        } else if (sortField === "price") {
          aValue = parseFloat(aValue || 0);
          bValue = parseFloat(bValue || 0);
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

  // Fetch all products with filters
  const fetchProducts = useCallback(
    async (params = {}, forceRefresh = false) => {
      try {
        setLoading(true);
        const isFetchingAll = Object.keys(params).length === 0;
  
        // Chỉ sử dụng cache khi:
        // 1. Không có recently updated items
        // 2. Không force refresh
        // 3. Đang fetch all (không có params)
        if (
          isFetchingAll && 
          recentlyUpdatedRef.current.size === 0 && 
          !forceRefresh
        ) {
          const cached = localStorage.getItem("products");
          if (cached) {
            try {
              const cachedProducts = JSON.parse(cached);
              const sortedProducts = sortData(
                cachedProducts,
                sortConfig.field,
                sortConfig.order
              );
              setProducts(sortedProducts);
              setPagination((prev) => ({
                ...prev,
                total: cachedProducts.length,
              }));
              setLoading(false);
              return;
            } catch (cacheError) {
              console.error("Error parsing cached products:", cacheError);
              // Nếu cache bị corrupt, xóa và fetch mới
              localStorage.removeItem("products");
            }
          }
        }
  
        console.log("Fetching products from API...", { params, forceRefresh });
  
        const response = await getAllProducts(params);
        const productsData = response.data || response;
  
        // Lấy ảnh cho từng sản phẩm
        const productsWithImages = await Promise.all(
          productsData.map(async (product) => {
            try {
              const productId = product.productId || product.id;
              const imagesResponse = await getProductImages(productId);
              const images = imagesResponse.data || imagesResponse || [];
  
              // Tìm ảnh chính (isPrimary = true) hoặc lấy ảnh đầu tiên
              const primaryImage =
                images.find((img) => img.isPrimary) || images[0];
  
              return {
                ...product,
                imageUrl: primaryImage?.imageUrl || null,
                images: images,
                createdAt:
                  product.createdAt ||
                  product.joinDate ||
                  new Date().toISOString(),
                updatedAt: product.updatedAt || new Date().toISOString(),
                status: product.status || "active",
              };
            } catch (error) {
              console.error(
                `Error fetching images for product ${product.id}:`,
                error
              );
              return {
                ...product,
                createdAt:
                  product.createdAt ||
                  product.joinDate ||
                  new Date().toISOString(),
                updatedAt: product.updatedAt || new Date().toISOString(),
                status: product.status || "active",
              };
            }
          })
        );
  
        // Apply filters
        let filteredData = productsWithImages;
  
        // Client-side filtering
        if (params.search) {
          const keywords = params.search
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .split(/\s+/);
  
          filteredData = filteredData.filter((product) => {
            const name =
              product.name
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") || "";
            const description = product.description?.toLowerCase() || "";
            const status = product.status?.toLowerCase() || "";
  
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
            (product) => product.status === params.status
          );
        }
  
        if (params.categoryId && params.categoryId !== "all") {
          filteredData = filteredData.filter(
            (product) => product.categoryId === params.categoryId
          );
        }
  
        if (params.brandId && params.brandId !== "all") {
          filteredData = filteredData.filter(
            (product) => product.brandId === params.brandId
          );
        }
  
        if (
          params.priceRange &&
          params.priceRange.min !== undefined &&
          params.priceRange.max !== undefined
        ) {
          filteredData = filteredData.filter((product) => {
            const price = parseFloat(product.price || 0);
            return (
              price >= params.priceRange.min && price <= params.priceRange.max
            );
          });
        }
  
        if (
          params.dateRange &&
          params.dateRange.start &&
          params.dateRange.end
        ) {
          filteredData = filteredData.filter((product) => {
            if (!product.createdAt && !product.joinDate) return false;
            const productDate = new Date(product.createdAt || product.joinDate);
            const startDate = new Date(params.dateRange.start);
            const endDate = new Date(params.dateRange.end);
            endDate.setHours(23, 59, 59, 999);
            return productDate >= startDate && productDate <= endDate;
          });
        }
  
        const sortedData = sortData(
          filteredData,
          sortConfig.field,
          sortConfig.order
        );
  
        console.log("Setting products:", {
          count: sortedData.length,
          recentlyUpdated: Array.from(recentlyUpdatedRef.current)
        });
  
        setProducts(sortedData);
        setPagination((prev) => ({
          ...prev,
          total: sortedData.length,
        }));
  
        // Chỉ cache khi không có filter và fetch thành công
        if (isFetchingAll && !forceRefresh) {
          localStorage.setItem("products", JSON.stringify(sortedData));
        }
      } catch (error) {
        message.error("Lỗi khi tải danh sách sản phẩm");
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [sortData, sortConfig]
  );

  // Fetch categories and brands
  const fetchMetadata = useCallback(async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        getAllCategories(),
        getAllBrands(),
      ]);
      setCategories(categoriesRes.data || categoriesRes);
      setBrands(brandsRes.data || brandsRes);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  }, []);

  // Create product - Move to top after success
  const createProductHandler = async (productData) => {
    try {
      setLoading(true);
  
      // Kiểm tra xem productData có phải là FormData không
      const isFormData = productData instanceof FormData;
  
      let response;
      if (isFormData) {
        // Sử dụng axios trực tiếp với config đúng
        response = await axios.post(
          "http://localhost:8080/api/products",
          productData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Sử dụng hàm API thông thường nếu không phải FormData
        response = await createProduct(productData);
      }
  
      message.success("Tạo sản phẩm thành công!");
  
      // Clear localStorage để đảm bảo không dùng cache cũ
      localStorage.removeItem("products");
  
      // Mark newly created product as recently updated
      const createdProduct = response.data || response;
      const productId = createdProduct.productId || createdProduct.id;
      if (productId) {
        recentlyUpdatedRef.current.add(productId);
        console.log("Marked new product as recently updated:", productId);
      }
  
      // Force refresh để lấy data mới từ server
      await fetchProducts({}, true);
  
      return response;
    } catch (error) {
      message.error(
        "Lỗi khi tạo sản phẩm: " + (error.message || "Không xác định")
      );
      console.error("Error creating product:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update product - Move to top after update
  const updateProductHandler = async (id, productData) => {
    try {
      console.log("Updating product:", { id, productData });
  
      const productId = typeof id === "object" ? id.productId || id.id : id;
  
      if (!productId) {
        throw new Error("Product ID is required for update");
      }
  
      const response = await updateProduct(productId, productData);
      message.success("Cập nhật sản phẩm thành công!");
  
      // Clear localStorage để đảm bảo không dùng cache cũ
      localStorage.removeItem("products");
      
      // Mark as recently updated
      recentlyUpdatedRef.current.add(productId);
      console.log("Marked as recently updated:", productId, Array.from(recentlyUpdatedRef.current));
  
      // Force refresh - bỏ qua cache hoàn toàn
      await fetchProducts({}, true);
  
      return response;
    } catch (error) {
      console.error("Update product error:", error);
      message.error("Lỗi khi cập nhật sản phẩm");
      throw error;
    }
  };

  // Delete product
  const deleteProductHandler = async (id) => {
    try {
      const productId = typeof id === "object" ? id.productId || id.id : id;
      if (!productId) throw new Error("Product ID required");

      await deleteProduct(productId);
      message.success("Xóa sản phẩm thành công!");

      // Remove from recently updated
      recentlyUpdatedRef.current.delete(productId);

      setProducts((prev) => {
        const filteredList = prev.filter(
          (product) => (product.productId || product.id) !== productId
        );
        localStorage.setItem("products", JSON.stringify(filteredList));
        return filteredList;
      });

      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      message.error("Lỗi khi xóa sản phẩm");
      console.error("Delete product error:", error);
      throw error;
    }
  };

  // Handle table pagination and sorting
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);

    if (sorter && sorter.field) {
      const newSortConfig = {
        field: sorter.field,
        order: sorter.order || "desc",
      };
      setSortConfig(newSortConfig);

      // Sắp xếp lại dữ liệu hiện tại
      setProducts((prev) =>
        sortData(prev, newSortConfig.field, newSortConfig.order)
      );
    }
  };

  // Filter products
  const filterProducts = useCallback(
    (filterParams) => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchProducts(filterParams, true);
    },
    [fetchProducts]
  );

  const refreshProducts = useCallback(async () => {
    localStorage.removeItem("products");
    recentlyUpdatedRef.current.clear();
    await fetchProducts({}, true);
  }, [fetchProducts]);

  // Clear recently updated after some time
  useEffect(() => {
    const interval = setInterval(() => {
      recentlyUpdatedRef.current.clear();
    }, 30000); // Clear after 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts();
    fetchMetadata();
  }, [fetchProducts, fetchMetadata]);

  return {
    products,
    categories,
    brands,
    loading,
    pagination,
    sortConfig,
    fetchProducts,
    fetchMetadata,
    createProduct: createProductHandler,
    updateProduct: updateProductHandler,
    deleteProduct: deleteProductHandler,
    handleTableChange,
    filterProducts,
    refreshProducts,
  };
};

export default useProducts;
