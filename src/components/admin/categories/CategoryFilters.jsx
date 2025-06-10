import React, { useState } from "react";
import { Card, Form, Input, Button, Row, Col, Space, DatePicker } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { RangePicker } = DatePicker;

const CategoryFilters = ({ onFilter, onReset, loading = false }) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);

  const handleFilter = (values) => {
    // Lọc bỏ undefined, "all", "" ra khỏi filters
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== undefined && value !== "all" && value !== ""
      )
    );

    const filters = {
      ...values,
      ...cleanedValues,
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
          <span>Bộ lọc danh mục</span>
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
          status: "all", // nếu sau này có trạng thái
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Search */}
          <Col xs={24} sm={12} lg={12}>
            <Form.Item label="Tìm kiếm" name="search">
              <Search
                placeholder="Tên danh mục..."
                allowClear
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
              />
            </Form.Item>
          </Col>

          {expanded && (
            <>
              {/* Date Range */}
              <Col xs={24} sm={12} lg={12}>
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

export default CategoryFilters;
