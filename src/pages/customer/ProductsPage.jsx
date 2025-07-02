import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Slider,
  Divider,
  Typography,
  Select,
  Checkbox,
  Radio,
  Space,
  Button,
  Breadcrumb,
  Tag,
  Spin,
} from "antd";
import {
  AppstoreOutlined,
  BarsOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import ProductGrid from "../../components/customer/Products/ProductGrid";
import { Link } from "react-router-dom";
import useProductsData from "../../hooks/useProductsData";
import useCart from "../../hooks/useCart";
import { getAllCategories } from "../../services/categories";
import { getAllBrands } from "../../services/brands";

const { Title, Text } = Typography;
const { Search } = Input;

const ProductsPage = () => {
  // States for category and brand data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState(false);

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  // Get products from custom hook
  const {
    products: paginatedProducts,
    allProducts,
    loading,
    pagination,
    updateFilters,
    handlePaginationChange,
  } = useProductsData();

  // Get cart functionality
  const { addItemToCart, loading: cartLoading } = useCart();

  // Fetch categories and brands
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setCategoriesLoading(true);
        setBrandsLoading(true);

        const [categoriesRes, brandsRes] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
        ]);

        setCategories(categoriesRes.data || categoriesRes || []);
        setBrands(brandsRes.data || brandsRes || []);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      } finally {
        setCategoriesLoading(false);
        setBrandsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  // Handle add to cart
  const handleAddToCart = async (product, quantity = 1) => {
    try {
      const success = await addItemToCart(product, quantity);
      return success;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const searchInProduct = (product, term) => {
    if (!term) return true;
    
    const searchWords = term.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    
    return searchWords.every(word => {
      const productName = product.name?.toLowerCase() || '';
      
      // Get category name
      let categoryName = '';
      if (typeof product.category === 'object' && product.category?.name) {
        categoryName = product.category.name.toLowerCase();
      } else if (typeof product.category === 'string') {
        categoryName = product.category.toLowerCase();
      }
      
      // Get brand name
      let brandName = '';
      if (typeof product.brand === 'object' && product.brand?.name) {
        brandName = product.brand.name.toLowerCase();
      } else if (typeof product.brand === 'string') {
        brandName = product.brand.toLowerCase();
      }
      
      // Check if the word exists in any of the product's data
      return productName.includes(word) ||  
             categoryName.includes(word) || 
             brandName.includes(word);
    });
  };

  // Apply filters to all products
  const getFilteredProducts = useCallback(() => {
    let filtered = allProducts || [];

    if (searchTerm) {
      filtered = filtered.filter(product => searchInProduct(product, searchTerm));
    }

    // Price range filter
    if (priceRange[0] > 0 || priceRange[1] < 20000000) {
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter(
        (product) => product.remainQuantity > 0 || product.stockQuantity > 0
      );
    }

    return filtered;
  }, [
    allProducts,
    searchTerm,
    priceRange,
    inStockOnly,
  ]);

  // Sort filtered products
  const getSortedProducts = useCallback(() => {
    const filtered = getFilteredProducts();

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [getFilteredProducts, sortBy]);

  // Get paginated results
  const getPaginatedResults = useCallback(() => {
    const sortedProducts = getSortedProducts();
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    return {
      products: sortedProducts.slice(startIndex, endIndex),
      total: sortedProducts.length,
    };
  }, [getSortedProducts, pagination.current, pagination.pageSize]);

  const { products: displayProducts, total } = getPaginatedResults();

  // Handle pagination change
  const onPageChange = (page, pageSize) => {
    handlePaginationChange(page, pageSize);
  };

  // Apply filters function
  const applyFilters = useCallback(() => {
    // Reset to first page when applying filters
    handlePaginationChange(1, pagination.pageSize);
  }, [handlePaginationChange, pagination.pageSize]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 20000000]);
    setInStockOnly(false);
    setSortBy("featured");

    updateFilters({});
  };

  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);
    handlePaginationChange(1, pagination.pageSize); // Reset to first page
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          {
            title: (
              <Link to="/" className="hover:no-underline">
                Trang chủ
              </Link>
            ),
            href: "/",
          },
          { title: "Sản phẩm" },
        ]}
        className="mb-4"
      />

      <Title level={2} className="mb-6 text-center">
        Bộ Sưu Tập Đồng Hồ
      </Title>

      <Row gutter={[24, 24]}>
        {/* Sidebar Filters */}
        <Col xs={24} lg={6}>
          <Card className="filter-sidebar">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} className="m-0">
                Bộ lọc
              </Title>
              <Button
                icon={<ReloadOutlined />}
                onClick={resetFilters}
                size="small"
              >
                Đặt lại
              </Button>
            </div>

            <Divider />

            <div className="mb-4">
              <Text strong>Tìm kiếm sản phẩm</Text>
              <Search
                placeholder="Tìm theo tên, danh mục, thương hiệu..."
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                enterButton
                className="mt-2"
              />
              <div className="mt-2 text-xs text-gray-500">
                Tìm kiếm linh hoạt theo tên sản phẩm, danh mục hoặc thương hiệu
              </div>
            </div>

            <Divider />

            <div className="mb-4">
              <Text strong>Khoảng giá</Text>
              <Slider
                range
                min={0}
                max={20000000}
                step={100000}
                value={priceRange}
                onChange={setPriceRange}
                className="mt-2"
              />
              <div className="flex justify-between">
                <Text>{priceRange[0].toLocaleString()} VNĐ</Text>
                <Text>{priceRange[1].toLocaleString()} VNĐ</Text>
              </div>
            </div>

            <Divider />

            <Checkbox
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            >
              Chỉ hiện sản phẩm còn hàng
            </Checkbox>

            <Button
              type="primary"
              block
              className="mt-4"
              onClick={applyFilters}
            >
              Áp dụng bộ lọc
            </Button>
          </Card>
        </Col>

        {/* Product List */}
        <Col xs={24} lg={18}>
          <Card className="mb-4">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <Text className="mr-2">Hiển thị {total} sản phẩm</Text>
                {searchTerm && (
                  <Tag closable onClose={() => setSearchTerm("")}>
                    Tìm kiếm: {searchTerm}
                  </Tag>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <Text className="mr-2">Sắp xếp:</Text>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 150 }}
                  options={[
                    { value: "featured", label: "Nổi bật" },
                    { value: "priceAsc", label: "Giá tăng dần" },
                    { value: "priceDesc", label: "Giá giảm dần" },
                    { value: "nameAsc", label: "A-Z" },
                    { value: "nameDesc", label: "Z-A" },
                  ]}
                />

                {/* <div className="view-switcher ml-2">
                  <Radio.Group
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="grid">
                      <AppstoreOutlined />
                    </Radio.Button>
                    <Radio.Button value="list">
                      <BarsOutlined />
                    </Radio.Button>
                  </Radio.Group>
                </div> */}
              </div>
            </div>
          </Card>

          {loading ? (
            <div className="text-center py-8">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <ProductGrid
                products={displayProducts}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: total,
                }}
                onPageChange={onPageChange}
                onAddToCart={handleAddToCart}
                cartLoading={cartLoading}
                viewMode={viewMode}
              />
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductsPage;