// hooks/useProductsData.js
import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { getAllProducts, getProductImages } from "../services/products";

const useProductsData = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for client-side pagination
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllProducts({
        ...filters,
        ...params,
      });
      
      const productsData = response.data || response || [];

      // Get images for each product
      const productsWithImages = await Promise.all(
        productsData.map(async (product) => {
          try {
            const productId = product.productId || product.id;
            const imagesResponse = await getProductImages(productId);
            const images = imagesResponse.data || imagesResponse || [];

            // Find primary image or use first image
            const primaryImage = 
              images.find((img) => img.isPrimary) || images[0];

            return {
              ...product,
              imageUrl: primaryImage?.imageUrl || null,
              images: images,
            };
          } catch (error) {
            console.error(`Error fetching images for product ${product.id}:`, error);
            return product;
          }
        })
      );

      // Filter active products
      const activeProducts = productsWithImages.filter(
        (product) => product.active === true || product.active === "true" || product.isActive === true
      );
      
      // Store all active products
      setAllProducts(activeProducts);
      
      // Set total count for pagination
      setPagination(prev => ({
        ...prev,
        total: activeProducts.length,
      }));
      
      // Apply pagination on the client side
      const { current, pageSize } = pagination;
      const startIndex = (current - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      // Set the paginated products
      setProducts(activeProducts.slice(startIndex, endIndex));
      
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      message.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize]);

  const updateFilters = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    
    // Reset pagination when filters change
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
    
    // If we already have all products, we can paginate without fetching again
    if (allProducts.length > 0) {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setProducts(allProducts.slice(startIndex, endIndex));
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    filters,
    pagination,
    fetchProducts,
    updateFilters,
    handlePaginationChange
  };
};

export default useProductsData;