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

const CustomerFilters = ({ onFilter, onReset, loading = false }) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);

  const handleFilter = (values) => {
    console.log("Filter values:", values); // Debug log

    // Lọc bỏ các giá trị "all" và undefined
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== undefined && value !== "all" && value !== ""
      )
    );

    const filters = {
      ...cleanedValues,
      dateRange: values.dateRange
        ? {
            start: values.dateRange[0]?.format("YYYY-MM-DD"),
            end: values.dateRange[1]?.format("YYYY-MM-DD"),
          }
        : null,
    };

    console.log("Processed filters:", filters); // Debug log
    onFilter(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
    console.log("Filters reset"); // Debug log
  };

  const handleSearch = (value) => {
    console.log("Search value:", value); // Debug log
    if (value && value.trim()) {
      onFilter({ search: value.trim() });
    } else {
      onFilter({});
    }
  };

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <span>Bộ lọc khách hàng</span>
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
          role: "all",
          gender: "all",
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Search */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Tìm kiếm" name="search">
              <Search
                placeholder="Tên, email, số điện thoại..."
                allowClear
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
              />
            </Form.Item>
          </Col>

          {/* Status */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Trạng thái" name="status">
              <Select>
                <Option value="all">Tất cả</Option>
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Ngừng hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Gender */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Giới tính" name="gender">
              <Select>
                <Option value="all">Tất cả</Option>
                <Option value="M">Nam</Option>
                <Option value="F">Nữ</Option>
              </Select>
            </Form.Item>
          </Col>

          {expanded && (
            <>
              {/* Date Range */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Ngày tham gia" name="dateRange">
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
                className="bg-blue-600 hover:bg-blue-700"
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

export default CustomerFilters;
