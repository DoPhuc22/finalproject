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

const AttributeValueFilters = ({
  products = [],
  attributeTypes = [],
  onFilter,
  onReset,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);

  const handleFilter = (values) => {
    // Loại bỏ các giá trị empty và xử lý dateRange
    const filteredValues = Object.keys(values).reduce((acc, key) => {
      if (
        values[key] !== undefined &&
        values[key] !== null &&
        values[key] !== "" &&
        values[key] !== "all"
      ) {
        // Xử lý đặc biệt cho dateRange
        if (
          key === "dateRange" &&
          Array.isArray(values[key]) &&
          values[key].length === 2
        ) {
          acc[key] = values[key].map((date) => date.format("YYYY-MM-DD"));
        } else {
          acc[key] = values[key];
        }
      }
      return acc;
    }, {});

    onFilter(filteredValues);
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({
      status: "all",
    });
    onReset();
  };

  const handleSearch = (value) => {
    if (value) {
      onFilter({ search: value });
    } else {
      // Nếu search rỗng, reset về tất cả
      const currentValues = form.getFieldsValue();
      delete currentValues.search;
      onFilter(currentValues);
    }
  };

  const handleQuickFilter = (filterType, filterValue) => {
    const currentValues = form.getFieldsValue();
    const newValues = {
      ...currentValues,
      [filterType]: filterValue,
    };

    form.setFieldsValue(newValues);
    handleFilter(newValues);
  };

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <span>Bộ lọc giá trị thuộc tính</span>
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
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Search */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Tìm kiếm" name="search">
              <Search
                placeholder="Tìm theo giá trị thuộc tính..."
                allowClear
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
              />
            </Form.Item>
          </Col>

          {/* Status */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Trạng thái" name="status">
              <Select placeholder="Chọn trạng thái" allowClear>
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="active">Đang hoạt động</Option>
                <Option value="inactive">Tạm ngưng</Option>
              </Select>
            </Form.Item>
          </Col>

          {expanded && (
            <>
              {/* Product */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Sản phẩm" name="product_id">
                  <Select
                    placeholder="Chọn sản phẩm"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {products.map((product) => (
                      <Option
                        key={product.id || product.productId}
                        value={product.id || product.productId}
                      >
                        {product.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Attribute Type */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Loại thuộc tính" name="attr_type_id">
                  <Select placeholder="Chọn loại thuộc tính" allowClear>
                    {attributeTypes.map((type) => (
                      <Option
                        key={type.attr_type_id || type.attrTypeId}
                        value={type.attr_type_id || type.attrTypeId}
                      >
                        {type.name}
                      </Option>
                    ))}
                  </Select>
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
                className="bg-blue-600 hover:bg-blue-700 border-blue-600"
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

        {/* Quick filters - always visible */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Lọc nhanh:</span>
            <Button
              size="small"
              onClick={() => handleQuickFilter("status", "active")}
              className="text-xs border-green-300 text-green-600 hover:border-green-400 hover:text-green-700"
            >
              Đang hoạt động
            </Button>
            <Button
              size="small"
              onClick={() => handleQuickFilter("status", "inactive")}
              className="text-xs border-red-300 text-red-600 hover:border-red-400 hover:text-red-700"
            >
              Tạm ngưng
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

export default AttributeValueFilters;
