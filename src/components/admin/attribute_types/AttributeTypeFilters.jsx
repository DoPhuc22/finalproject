import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
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

const AttributeTypeFilters = ({ onFilter, onReset, loading = false }) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);

  const handleFilter = (values) => {
    const filters = {
      ...values,
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
          <span>Bộ lọc loại thuộc tính</span>
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
                placeholder="Tên loại thuộc tính..."
                allowClear
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
              />
            </Form.Item>
          </Col>

          {/* Status */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Trạng thái" name="status">
              <Select defaultValue="all">
                <Option value="all">Tất cả</Option>
                <Option value="active">
                  <Space>
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    Hoạt động
                  </Space>
                </Option>
                <Option value="inactive">
                  <Space>
                    <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                    Ngừng hoạt động
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Quick Filter Buttons - Always Visible
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Trạng thái">
              <Space wrap>
                <Button
                  size="small"
                  onClick={() => {
                    form.setFieldsValue({ status: "active" });
                    handleFilter({ status: "active" });
                  }}
                  className="text-xs border-green-300 text-green-600 hover:border-green-400 hover:text-green-700"
                >
                  Đang hoạt động
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    form.setFieldsValue({ status: "inactive" });
                    handleFilter({ status: "inactive" });
                  }}
                  className="text-xs border-red-300 text-red-600 hover:border-red-400 hover:text-red-700"
                >
                  Ngừng hoạt động
                </Button>
              </Space>
            </Form.Item>
          </Col> */}

          {expanded && (
            <>
              {/* Date Range */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Ngày tạo" name="dateRange">
                  <RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
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
                className="bg-orange-600 hover:bg-orange-700 border-orange-600"
              >
                Tìm kiếm
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
                className="border-slate-300 hover:border-orange-400"
              >
                Đặt lại
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AttributeTypeFilters;