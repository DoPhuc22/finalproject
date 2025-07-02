import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Space,
  InputNumber,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ProductFilters = ({
  categories = [],
  brands = [],
  onFilter,
  onReset,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);

  const handleFilter = (values) => {
    console.log("ProductFilters - Raw form values:", values);

    // Xử lý và làm sạch các giá trị filter
    const filters = {};

    // Tìm kiếm
    if (values.search && values.search.trim()) {
      filters.search = values.search.trim();
    }

    // Danh mục
    if (values.categoryId) {
      filters.categoryId = values.categoryId;
    }

    // Thương hiệu
    if (values.brandId) {
      filters.brandId = values.brandId;
    }

    // Trạng thái kho
    if (values.inStock && values.inStock !== "all") {
      filters.inStock = values.inStock;
    }

    // Khoảng giá
    if (values.priceRange && Array.isArray(values.priceRange)) {
      const [minPrice, maxPrice] = values.priceRange;
      if (minPrice !== undefined && minPrice !== null && minPrice >= 0) {
        filters.minPrice = minPrice;
      }
      if (maxPrice !== undefined && maxPrice !== null && maxPrice > 0) {
        filters.maxPrice = maxPrice;
      }
    }

    // Khoảng ngày
    if (
      values.dateRange &&
      Array.isArray(values.dateRange) &&
      values.dateRange.length === 2
    ) {
      filters.dateFrom = values.dateRange[0]?.startOf("day").toISOString();
      filters.dateTo = values.dateRange[1]?.endOf("day").toISOString();
    }

    // Trạng thái sản phẩm
    if (values.status && values.status !== "all") {
      filters.status = values.status;
    }

    console.log("ProductFilters - Processed filters:", filters);
    onFilter(filters);
  };

  const handleReset = () => {
    console.log("ProductFilters - Resetting filters");
    form.resetFields();
    onReset();
  };

  const handleSearch = (value) => {
    console.log("ProductFilters - Search value:", value);

    if (value && value.trim()) {
      onFilter({ search: value.trim() });
    } else {
      // Nếu tìm kiếm trống, reset về tất cả sản phẩm
      onFilter({});
    }
  };

  // Xử lý thay đổi select nhanh
  const handleQuickFilter = (filterType, filterValue) => {
    const currentValues = form.getFieldsValue();
    form.setFieldsValue({ [filterType]: filterValue });

    const updatedValues = {
      ...currentValues,
      [filterType]: filterValue,
    };

    console.log("ProductFilters - Quick filter:", {
      filterType,
      filterValue,
      updatedValues,
    });
    handleFilter(updatedValues);
  };

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <span>Bộ lọc sản phẩm</span>
        </Space>
      }
      extra={
        <Button type="link" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Thu gọn" : "Mở rộng"}
        </Button>
      }
      className="mb-4"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFilter}
        initialValues={{
          status: "all",
          inStock: "all",
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Search */}
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Tìm kiếm" name="search">
              <Search
                placeholder="Tên sản phẩm, SKU..."
                allowClear
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
              />
            </Form.Item>
          </Col>

          {/* Category */}
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Danh mục" name="categoryId">
              <Select
                placeholder="Chọn danh mục"
                allowClear
                onChange={(value) => handleQuickFilter("categoryId", value)}
              >
                {categories.map((category) => (
                  <Option
                    key={category.categoryId || category.id}
                    value={category.categoryId || category.id}
                  >
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Brand */}
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Thương hiệu" name="brandId">
              <Select
                placeholder="Chọn thương hiệu"
                allowClear
                onChange={(value) => handleQuickFilter("brandId", value)}
              >
                {brands.map((brand) => (
                  <Option
                    key={brand.brandId || brand.id}
                    value={brand.brandId || brand.id}
                  >
                    {brand.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Stock Status */}
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Trạng thái kho" name="inStock">
              <Select
                defaultValue="all"
                onChange={(value) => handleQuickFilter("inStock", value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value={true}>Còn hàng</Option>
                <Option value={false}>Hết hàng</Option>
              </Select>
            </Form.Item>
          </Col>

          {expanded && (
            <>
              {/* Price Range */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Khoảng giá">
                  <Input.Group compact>
                    <Form.Item name={["priceRange", 0]} noStyle>
                      <InputNumber
                        placeholder="Giá từ"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                        style={{ width: "50%" }}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item name={["priceRange", 1]} noStyle>
                      <InputNumber
                        placeholder="Giá đến"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                        style={{ width: "50%" }}
                        min={0}
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>

              {/* Date Range */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Ngày tạo" name="dateRange">
                  <RangePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder={["Từ ngày", "Đến ngày"]}
                  />
                </Form.Item>
              </Col>

              {/* Status */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Trạng thái" name="status">
                  <Select
                    defaultValue="all"
                    onChange={(value) => handleQuickFilter("status", value)}
                  >
                    <Option value="all">Tất cả</Option>
                    <Option value="active">Đang bán</Option>
                    <Option value="inactive">Ngừng bán</Option>
                    <Option value="draft">Bản nháp</Option>
                  </Select>
                </Form.Item>
              </Col>
            </>
          )}
        </Row>

        <Row>
          <Col span={24}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tìm kiếm
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                className="border-slate-300 hover:border-blue-400"
              >
                Đặt lại
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Quick filter buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Lọc nhanh:</span>
            <Button
              size="small"
              onClick={() => handleQuickFilter("status", "active")}
              className="text-xs border-green-300 text-green-600 hover:border-green-400 hover:text-green-700"
            >
              Đang bán
            </Button>
            <Button
              size="small"
              onClick={() => handleQuickFilter("status", "inactive")}
              className="text-xs border-red-300 text-red-600 hover:border-red-400 hover:text-red-700"
            >
              Ngừng bán
            </Button>
            <Button
              size="small"
              onClick={() => handleQuickFilter("inStock", true)}
              className="text-xs border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-700"
            >
              Còn hàng
            </Button>
            <Button
              size="small"
              onClick={handleReset}
              className="text-xs border-slate-300 text-slate-600 hover:border-slate-400"
            >
              Tất cả
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default ProductFilters;
