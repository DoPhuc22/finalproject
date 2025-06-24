import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  ShopOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ProductGrid from "../../components/customer/Products/ProductGrid";
import { Link } from "react-router-dom";
import useProductsData from "../../hooks/useProductsData";
import useCart from "../../hooks/useCart"; // Import useCart hook
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
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
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

  // Apply filters to all products
  const getFilteredProducts = useCallback(() => {
    let filtered = allProducts || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => {
        const productCategoryId =
          product.categoryId || product.category?.id || product.category;
        return selectedCategories.includes(productCategoryId);
      });
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => {
        const productBrandId =
          product.brandId || product.brand?.id || product.brand;
        return selectedBrands.includes(productBrandId);
      });
    }

    // Price range filter
    if (priceRange[0] > 0 || priceRange[1] < 5000000) {
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
    selectedCategories,
    selectedBrands,
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
    setPriceRange([0, 5000000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setSortBy("featured");

    updateFilters({});
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
              <Text strong>Tìm kiếm</Text>
              <Search
                placeholder="Nhập từ khóa..."
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2"
              />
            </div>

            <Divider />

            <div className="mb-4">
              <Text strong>Khoảng giá</Text>
              <Slider
                range
                min={0}
                max={5000000}
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

            <div className="mb-4">
              <Text strong>Danh mục</Text>
              <div className="mt-2">
                <Checkbox.Group
                  options={categories.map((c) => ({
                    label: c.name || c,
                    value: c.categoryId || c.id || c,
                  }))}
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                  className="flex flex-col gap-2"
                  loading={categoriesLoading}
                />
              </div>
            </div>

            <Divider />

            <div className="mb-4">
              <Text strong>Thương hiệu</Text>
              <div className="mt-2">
                <Checkbox.Group
                  options={brands.map((b) => ({
                    label: b.name || b,
                    value: b.brandId || b.id || b,
                  }))}
                  value={selectedBrands}
                  onChange={setSelectedBrands}
                  className="flex flex-col gap-2"
                  loading={brandsLoading}
                />
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
                {selectedCategories.length > 0 && (
                  <Space size={[0, 8]} wrap className="mt-2">
                    {selectedCategories.map((cat) => {
                      const categoryName =
                        categories.find((c) => (c.categoryId || c.id) === cat)
                          ?.name || cat;

                      return (
                        <Tag
                          key={cat}
                          closable
                          onClose={() =>
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== cat)
                            )
                          }
                        >
                          {categoryName}
                        </Tag>
                      );
                    })}
                  </Space>
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
                    { value: "rating", label: "Đánh giá cao" },
                  ]}
                />

                <div className="view-switcher ml-2">
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
                </div>
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
              />
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductsPage;