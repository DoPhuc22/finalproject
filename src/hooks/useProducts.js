import { useState, useEffect, useCallback } from "react";
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

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch all products with filters
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllProducts(params);
      setProducts(response.data || response);
      setPagination((prev) => ({
        ...prev,
        total: response.total || response.length || 0,
      }));
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Create product
  const createProductHandler = async (productData) => {
    try {
      const response = await createProduct(productData);
      message.success("Tạo sản phẩm thành công!");
      fetchProducts(); // Refresh list
      return response;
    } catch (error) {
      message.error("Lỗi khi tạo sản phẩm");
      throw error;
    }
  };

  // Update product
  const updateProductHandler = async (id, productData) => {
    try {
      const response = await updateProduct(id, productData);
      message.success("Cập nhật sản phẩm thành công!");
      fetchProducts(); // Refresh list
      return response;
    } catch (error) {
      message.error("Lỗi khi cập nhật sản phẩm");
      throw error;
    }
  };

  // Delete product
  const deleteProductHandler = async (id) => {
    try {
      await deleteProduct(id);
      message.success("Xóa sản phẩm thành công!");
      fetchProducts(); // Refresh list
    } catch (error) {
      message.error("Lỗi khi xóa sản phẩm");
      throw error;
    }
  };

  // Handle pagination change
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    fetchProducts({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
      sortBy: sorter.field,
      sortOrder: sorter.order,
    });
  };

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
    fetchProducts,
    createProduct: createProductHandler,
    updateProduct: updateProductHandler,
    deleteProduct: deleteProductHandler,
    handleTableChange,
  };
};

export default useProducts;
