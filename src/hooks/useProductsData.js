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

      // Lọc sản phẩm active (chỉ hiển thị sản phẩm đang hoạt động)
      const activeProducts = productsWithImages.filter(product => 
        product.active === true || product.active === 'true' || product.isActive === true
      );

      setProducts(activeProducts);
      setPagination(prev => ({
        ...prev,
        total: activeProducts.length
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
    // Reset pagination khi thay đổi filter
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
    
    // Không cần gọi fetchProducts lại vì chúng ta đã có tất cả data
    // Pagination sẽ được xử lý ở component level
  };

  // Get paginated products (xử lý phân trang ở client-side)
  const getPaginatedProducts = useCallback(() => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return products.slice(startIndex, endIndex);
  }, [products, pagination.current, pagination.pageSize]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products: getPaginatedProducts(), // Trả về products đã phân trang
    allProducts: products, // Trả về tất cả products nếu cần
    loading,
    pagination,
    filters,
    fetchProducts,
    updateFilters,
    handlePaginationChange
  };
};

export default useProductsData;