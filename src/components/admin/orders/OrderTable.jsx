import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Popconfirm,
  Tooltip,
  Select,
  Badge,
  Empty,
  Modal,
  Descriptions,
  Divider,
  Card,
  Row,
  Col,
  Form,
  Input,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShoppingOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  DollarOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

const OrderTable = ({
  orders = [],
  loading = false,
  pagination = {},
  onStatusUpdate,
  onUpdateReceiver,
  onDelete,
  onTableChange,
}) => {
  const [statusLoading, setStatusLoading] = useState({});
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [receiverModalVisible, setReceiverModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receiverForm] = Form.useForm();

  const handleStatusChange = async (orderId, newStatus) => {
  try {
    setStatusLoading(prev => ({ ...prev, [orderId]: true }));
    
    // Đảm bảo dữ liệu gửi đi đúng định dạng
    await onStatusUpdate(orderId, newStatus);
    
    // Hiển thị thông báo thành công
    message.success(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`);
  } catch (error) {
    console.error("Error changing status:", error);
    
    // Hiển thị thông báo lỗi chi tiết
    let errorMessage = "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng";
    
    if (error.response?.data?.message) {
      errorMessage += `: ${error.response.data.message}`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    
    message.error(errorMessage);
  } finally {
    setStatusLoading(prev => ({ ...prev, [orderId]: false }));
  }
};

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const showReceiverModal = (order) => {
    setSelectedOrder(order);
    receiverForm.setFieldsValue({
      receiverName: order.receiverName,
      receiverPhone: order.receiverPhone,
      receiverAddress: order.shippingAddress,
    });
    setReceiverModalVisible(true);
  };

  const handleReceiverUpdate = async (values) => {
    try {
      await onUpdateReceiver(selectedOrder.orderId, values);
      setReceiverModalVisible(false);
      receiverForm.resetFields();
    } catch (error) {
      console.error("Error updating receiver:", error);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "orange",
      confirmed: "blue",
      processing: "cyan",
      shipping: "purple",
      delivered: "green",
      cancelled: "red",
      returned: "volcano",
    };
    return statusColors[status] || "default";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipping: "Đang giao hàng",
      delivered: "Đã giao hàng",
      cancelled: "Đã hủy",
      returned: "Đã trả hàng",
    };
    return statusTexts[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const methodTexts = {
      cod: "Thanh toán khi nhận hàng",
      vnpay: "VNPay",
    };
    return methodTexts[method] || method;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      width: 60,
      fixed: "left",
      render: (orderId) => (
        <Text code className="text-blue-600 font-medium">
          #{orderId}
        </Text>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <UserOutlined className="mr-2 text-blue-500" />
            <Text strong>{record.receiverName}</Text>
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <PhoneOutlined className="mr-2" />
            <Text className="text-xs">{record.receiverPhone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 120,
      align: "center",
      render: (total) => (
        <div className="text-center">
          <Text strong className="text-green-600">
            {formatCurrency(total)}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 180,
      align: "center",
      render: (status, record) => (
        <Select
          value={status}
          loading={statusLoading[record.orderId]}
          onChange={(newStatus) => handleStatusChange(record.orderId, newStatus)}
          className="w-30"
          size="large"
        >
          <Option value="pending">
            <Tag color="orange">Chờ xác nhận</Tag>
          </Option>
          <Option value="confirmed">
            <Tag color="blue">Đã xác nhận</Tag>
          </Option>
          <Option value="processing">
            <Tag color="cyan">Đang xử lý</Tag>
          </Option>
          <Option value="shipping">
            <Tag color="purple">Đang giao hàng</Tag>
          </Option>
          <Option value="delivered">
            <Tag color="green">Đã giao hàng</Tag>
          </Option>
          <Option value="cancelled">
            <Tag color="red">Đã hủy</Tag>
          </Option>
          <Option value="returned">
            <Tag color="volcano">Đã trả hàng</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 150,
      render: (method) => (
        <div className="flex items-center">
          <CreditCardOutlined className="mr-2 text-green-500" />
          <Text className="text-xs">{getPaymentMethodText(method)}</Text>
        </div>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 120,
      render: (date) => (
        <div className="flex items-center text-gray-600">
          <CalendarOutlined className="mr-2" />
          <Text className="text-xs">
            {new Date(date).toLocaleDateString("vi-VN")}
          </Text>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 160,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showOrderDetail(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa đơn hàng này?"
              onConfirm={() => onDelete(record.orderId)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-700"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={{
          ...pagination,
          className: "px-4 py-3 bg-slate-50",
        }}
        onChange={onTableChange}
        rowKey="orderId"
        scroll={{ x: 1400 }}
        className="custom-table"
        size="middle"
        locale={{
          emptyText: (
            <Empty
              description="Không có đơn hàng"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />

      {/* Order Detail Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <ShoppingOutlined className="mr-2 text-blue-500" />
            <span>Chi tiết đơn hàng #{selectedOrder?.orderId}</span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <Card title="Thông tin đơn hàng" size="small">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Mã đơn hàng">
                  <Text code>#{selectedOrder.orderId}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt hàng">
                  {new Date(selectedOrder.orderDate).toLocaleString("vi-VN")}
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  {getPaymentMethodText(selectedOrder.paymentMethod)}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Customer Info */}
            <Card title="Thông tin khách hàng" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tên người nhận">
                  {selectedOrder.receiverName}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {selectedOrder.receiverPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ giao hàng">
                  {selectedOrder.shippingAddress}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Order Items */}
            {selectedOrder.details && selectedOrder.details.length > 0 && (
              <Card title="Sản phẩm đặt hàng" size="small">
                <div className="space-y-3">
                  {selectedOrder.details.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <Text strong>Sản phẩm #{item.productId}</Text>
                        <div className="text-sm text-gray-500">
                          Số lượng: {item.quantity} x {formatCurrency(item.unitPrice)}
                        </div>
                      </div>
                      <Text strong className="text-green-600">
                        {formatCurrency(item.lineTotal)}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Order Summary */}
            <Card title="Tổng kết đơn hàng" size="small">
              <div className="space-y-2">
                {/* <div className="flex justify-between">
                  <Text>Tạm tính:</Text>
                  <Text>{formatCurrency(selectedOrder.subtotal)}</Text>
                </div>
                <Divider className="my-2" /> */}
                <div className="flex justify-between">
                  <Text strong className="text-lg">Tổng cộng:</Text>
                  <Text strong className="text-lg text-green-600">
                    {formatCurrency(selectedOrder.total)}
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderTable;