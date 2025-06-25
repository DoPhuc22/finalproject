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

const OrderFilters = ({
  onFilter,
  onReset,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);

  const handleFilter = (values) => {
    // Process date range
    if (values.dateRange) {
      values.dateRange = [
        values.dateRange[0].startOf('day').toDate(),
        values.dateRange[1].endOf('day').toDate()
      ];
    }
    onFilter(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const handleSearch = (value) => {
    onFilter({ search: value });
  };

  const handleQuickFilter = (filterType, filterValue) => {
    form.setFieldsValue({ [filterType]: filterValue });
    onFilter({ [filterType]: filterValue });
  };

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <span>Bộ lọc đơn hàng</span>
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
          paymentMethod: "all",
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Search */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Tìm kiếm" name="search">
              <Search
                placeholder="Tìm theo mã đơn, tên người nhận, SĐT..."
                allowClear
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
              />
            </Form.Item>
          </Col>

          {/* Status */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Trạng thái" name="status">
              <Select placeholder="Chọn trạng thái">
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="pending">Chờ xác nhận</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="shipping">Đang giao hàng</Option>
                <Option value="delivered">Đã giao hàng</Option>
                <Option value="cancelled">Đã hủy</Option>
                <Option value="returned">Đã trả hàng</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Payment Method */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="Phương thức thanh toán" name="paymentMethod">
              <Select placeholder="Chọn phương thức">
                <Option value="all">Tất cả phương thức</Option>
                <Option value="cod">Thanh toán khi nhận hàng</Option>
                <Option value="vnpay">VNPay</Option>
                <Option value="banking">Chuyển khoản</Option>
                <Option value="wallet">Ví điện tử</Option>
              </Select>
            </Form.Item>
          </Col>

          {expanded && (
            <>
              {/* Date Range */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Khoảng thời gian" name="dateRange">
                  <RangePicker
                    placeholder={["Từ ngày", "Đến ngày"]}
                    format="DD/MM/YYYY"
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              {/* Total Amount Range */}
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label="Khoảng giá trị đơn hàng" name="totalRange">
                  <Input.Group compact>
                    <Form.Item name={['totalRange', 'min']} noStyle>
                      <Input
                        placeholder="Từ"
                        className="w-1/2"
                        type="number"
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item name={['totalRange', 'max']} noStyle>
                      <Input
                        placeholder="Đến"
                        className="w-1/2"
                        type="number"
                        min={0}
                      />
                    </Form.Item>
                  </Input.Group>
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
              onClick={() => handleQuickFilter("status", "pending")}
              className="text-xs border-orange-300 text-orange-600 hover:border-orange-400 hover:text-orange-700"
            >
              Chờ xác nhận
            </Button>
            <Button
              size="small"
              onClick={() => handleQuickFilter("status", "confirmed")}
              className="text-xs border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-700"
            >
              Đã xác nhận
            </Button>
            <Button
              size="small"
              onClick={() => handleQuickFilter("status", "shipping")}
              className="text-xs border-purple-300 text-purple-600 hover:border-purple-400 hover:text-purple-700"
            >
              Đang giao hàng
            </Button>
            <Button
              size="small"
              onClick={() => handleQuickFilter("status", "delivered")}
              className="text-xs border-green-300 text-green-600 hover:border-green-400 hover:text-green-700"
            >
              Đã giao hàng
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

export default OrderFilters;