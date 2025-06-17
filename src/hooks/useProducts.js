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
  });

  // Fetch all products with filters
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      if (Object.keys(params).length === 0) {
        const cached = localStorage.getItem("products");
        if (cached) {
          setProducts(JSON.parse(cached));
          setPagination((prev) => ({
            ...prev,
            total: JSON.parse(cached).length,
          }));
          setLoading(false);
          return;
        }
      }
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
            };
          } catch (error) {
            console.error(
              `Error fetching images for product ${product.id}:`,
              error
            );
            return product; // Trả về sản phẩm gốc nếu không lấy được ảnh
          }
        })
      );

      let filteredProducts = productsWithImages;

      if (!params.status || params.status === "active") {
        filteredProducts = filteredProducts.filter(
          (product) => product.status === "active" || product.isActive === true
        );
      }
      if (!params.active || params.active === "true") {
        filteredProducts = filteredProducts.filter(
          (product) => product.active === "true" || product.isActive === true
        );
      }
      setProducts(productsWithImages);
      setPagination((prev) => ({
        ...prev,
        total: response.total || response.length || 0,
      }));
      if (Object.keys(params).length === 0) {
        localStorage.setItem("products", JSON.stringify(productsWithImages));
      }
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
      localStorage.removeItem("products");
      // Đảm bảo cập nhật danh sách sản phẩm
      await fetchProducts();
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

  // Update product
  const updateProductHandler = async (id, productData) => {
    try {
      console.log("Updating product:", { id, productData }); // Debug log

      // Đảm bảo ID là number hoặc string, không phải object
      const productId = typeof id === "object" ? id.productId || id.id : id;

      if (!productId) {
        throw new Error("Product ID is required for update");
      }

      const response = await updateProduct(productId, productData);
      message.success("Cập nhật sản phẩm thành công!");

      // Cập nhật product trong danh sách và đưa lên đầu
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.filter(
          (product) => (product.productId || product.id) !== productId
        );

        // Tạo product đã cập nhật với dữ liệu mới
        const updatedProduct = {
          ...prevProducts.find(
            (product) => (product.productId || product.id) === productId
          ),
          ...productData,
          productId: productId,
          id: productId,
          joinDate:
            prevProducts.find(
              (product) => (product.productId || product.id) === productId
            )?.joinDate || new Date().toISOString(),
        };

        // Đưa product đã cập nhật lên đầu danh sách
        const newList = [updatedProduct, ...updatedProducts];
        localStorage.setItem("products", JSON.stringify(newList));
        return newList;
      });

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
      await deleteProduct(id);
      message.success("Xóa sản phẩm thành công!");
      localStorage.removeItem("products");
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
  }, []);

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
