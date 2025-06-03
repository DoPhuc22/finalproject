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
    const filters = {
      ...values,
      priceRange: values.priceRange
        ? {
            min: values.priceRange[0],
            max: values.priceRange[1],
          }
        : null,
      dateRange: values.dateRange
        ? {
            start: values.dateRange[0]?.format("YYYY-MM-DD"),
            end: values.dateRange[1]?.format("YYYY-MM-DD"),
          }
        : null,
    };
    onFilter(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const handleSearch = (value) => {
    onFilter({ search: value });
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
              <Select placeholder="Chọn danh mục" allowClear>
                {categories.map((category) => (
                  <Option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Brand */}
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Thương hiệu" name="brandId">
              <Select placeholder="Chọn thương hiệu" allowClear>
                {brands.map((brand) => (
                  <Option key={brand.brandId} value={brand.brandId}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Stock Status */}
          <Col xs={24} sm={12} lg={6}>
            <Form.Item label="Trạng thái kho" name="inStock">
              <Select defaultValue="all">
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
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        style={{ width: "50%" }}
                      />
                    </Form.Item>
                    <Form.Item name={["priceRange", 1]} noStyle>
                      <InputNumber
                        placeholder="Giá đến"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        style={{ width: "50%" }}
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>

              {/* Date Range */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Ngày tạo" name="dateRange">
                  <RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>

              {/* Status */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Trạng thái" name="status">
                  <Select defaultValue="all">
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
              >
                Tìm kiếm
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Đặt lại
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ProductFilters;
