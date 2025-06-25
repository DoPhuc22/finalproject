import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getAllProducts, getProductImages } from '../services/products';

const useProductsData = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });

  // Fetch products with filters - Hàm này được gọi lại mỗi khi filters thay đổi
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching products with filters:', filters);

      // Gọi API với các filter được cung cấp
      const response = await getAllProducts(filters);
      const productsData = response.data || response || [];

      // Xử lý dữ liệu sản phẩm và lấy thêm ảnh
      const productsWithImages = await Promise.all(
        productsData.map(async (product) => {
          try {
            // Lấy ID sản phẩm (xử lý các trường hợp khác nhau)
            const productId = product.productId || product.id;
            
            // Lấy danh sách hình ảnh của sản phẩm
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
      setAllProducts(activeProducts);
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

  // Fetch products on component mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update filters
  const updateFilters = (newFilters) => {
    console.log('Updating filters to:', newFilters);
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
  };

  // Get paginated products (xử lý phân trang ở client-side nếu cần)
  const getPaginatedProducts = useCallback(() => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return products.slice(startIndex, endIndex);
  }, [products, pagination.current, pagination.pageSize]);

  // Lấy danh sách sản phẩm đã phân trang
  const paginatedProducts = getPaginatedProducts();

  return {
    products: paginatedProducts,
    allProducts,
    loading,
    pagination,
    updateFilters,
    handlePaginationChange,
    fetchProducts
  };
};

export default useProductsData;