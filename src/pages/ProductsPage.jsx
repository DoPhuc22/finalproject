import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Row, Col, Card, Input, Slider, Divider, 
  Typography, Select, Checkbox, Radio, Space, 
  Button, Breadcrumb, Tag
} from 'antd';
import { 
  ShopOutlined, FilterOutlined, 
  AppstoreOutlined, BarsOutlined, 
  ReloadOutlined, SearchOutlined
} from '@ant-design/icons';
import ProductGrid from '../components/Products/ProductGrid';
import { selectAllProducts, selectFilteredProducts } from '../store/slices/productSlice';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;

const ProductsPage = () => {
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const productStatus = useSelector(state => state.products.status);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  
  // Get unique categories and brands for filters
  const categories = [...new Set(allProducts.map(p => p.category))];
  const brands = [...new Set(allProducts.map(p => p.brand))];
  
  // Filter products based on selected criteria
  const filteredProducts = useSelector(state => 
    selectFilteredProducts(state, {
      category: selectedCategories.length > 0 ? selectedCategories : null,
      priceRange: priceRange,
      brand: selectedBrands.length > 0 ? selectedBrands : null,
      inStock: inStockOnly ? true : undefined
    })
  );
  
  // Search within filtered products
  const searchedProducts = searchTerm 
    ? filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredProducts;
  
  // Sort products
  const sortedProducts = [...searchedProducts].sort((a, b) => {
    switch(sortBy) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
  
  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 5000000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb 
        items={[
          { title: <Link to="/" className="hover:no-underline">Trang chủ</Link>, href: '/' },
          { title: 'Sản phẩm' }
        ]}
        className="mb-4"
      />
      
      <Title level={2} className="mb-6 text-center">Bộ Sưu Tập Đồng Hồ</Title>
      
      <Row gutter={[24, 24]}>
        {/* Sidebar Filters */}
        <Col xs={24} lg={6}>
          <Card className="filter-sidebar">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} className="m-0">Bộ lọc</Title>
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
                onChange={e => setSearchTerm(e.target.value)}
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
                  options={categories.map(c => ({
                    label: c.charAt(0).toUpperCase() + c.slice(1),
                    value: c
                  }))}
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                  className="flex flex-col gap-2"
                />
              </div>
            </div>
            
            <Divider />
            
            <div className="mb-4">
              <Text strong>Thương hiệu</Text>
              <div className="mt-2">
                <Checkbox.Group 
                  options={brands}
                  value={selectedBrands}
                  onChange={setSelectedBrands}
                  className="flex flex-col gap-2"
                />
              </div>
            </div>
            
            <Divider />
            
            <Checkbox 
              checked={inStockOnly} 
              onChange={e => setInStockOnly(e.target.checked)}
            >
              Chỉ hiện sản phẩm còn hàng
            </Checkbox>
          </Card>
        </Col>
        
        {/* Product List */}
        <Col xs={24} lg={18}>
          <Card className="mb-4">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <Text className="mr-2">Hiển thị {sortedProducts.length} sản phẩm</Text>
                {selectedCategories.length > 0 && (
                  <Space size={[0, 8]} wrap className="mt-2">
                    {selectedCategories.map(cat => (
                      <Tag 
                        key={cat} 
                        closable 
                        onClose={() => setSelectedCategories(
                          selectedCategories.filter(c => c !== cat)
                        )}
                      >
                        {cat}
                      </Tag>
                    ))}
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
                    { value: 'featured', label: 'Nổi bật' },
                    { value: 'priceAsc', label: 'Giá tăng dần' },
                    { value: 'priceDesc', label: 'Giá giảm dần' },
                    { value: 'nameAsc', label: 'A-Z' },
                    { value: 'nameDesc', label: 'Z-A' },
                    { value: 'rating', label: 'Đánh giá cao' },
                  ]}
                />
                
                <div className="view-switcher ml-2">
                  <Radio.Group 
                    value={viewMode} 
                    onChange={e => setViewMode(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="grid"><AppstoreOutlined /></Radio.Button>
                    <Radio.Button value="list"><BarsOutlined /></Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </Card>
          
          <ProductGrid 
            products={sortedProducts}
            loading={productStatus === 'loading'}
            pagination={true}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProductsPage;