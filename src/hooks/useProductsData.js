// hooks/useProductsData.js
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getAllProducts, getProductImages } from '../services/products';

const useProductsData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0
  });

  // Fetch products with filters
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      
      // Combine current filters with new params
      const combinedParams = { ...filters, ...params };
      
      const response = await getAllProducts(combinedParams);
      const productsData = response.data || response;

      // Lấy ảnh cho từng sản phẩm
      const productsWithImages = await Promise.all(
        productsData.map(async (product) => {
          try {
            const productId = product.productId || product.id;
            const imagesResponse = await getProductImages(productId);
            const images = imagesResponse.data || imagesResponse || [];

            // Tìm ảnh chính (isPrimary = true) hoặc lấy ảnh đầu tiên
            const primaryImage = images.find(img => img.isPrimary) || images[0];

            return {
              ...product,
              imageUrl: primaryImage?.imageUrl || '/assets/images/products/default.jpg',
              images: images
            };
          } catch (error) {
            console.error(`Error fetching images for product ${product.id}:`, error);
            return {
              ...product,
              imageUrl: '/assets/images/products/default.jpg'
            };
          }
        })
      );

      setProducts(productsWithImages);
      setPagination(prev => ({
        ...prev,
        total: response.total || productsWithImages.length
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize
    });
    
    fetchProducts({
      page,
      pageSize
    });
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    pagination,
    filters,
    fetchProducts,
    updateFilters,
    handlePaginationChange
  };
};

export default useProductsData;