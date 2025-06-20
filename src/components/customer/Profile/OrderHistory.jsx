import React, { useState, useEffect } from "react";
import { 
  Table, 
  Typography, 
  Tag, 
  Button, 
  Space, 
  Spin, 
  Empty, 
  Modal, 
  Descriptions, 
  Divider, 
  Steps,
  message
} from "antd";
import { 
  ShoppingOutlined, 
  CheckCircleOutlined, 
  SyncOutlined, 
  ClockCircleOutlined, 
  TruckOutlined, 
  EnvironmentOutlined, 
  EyeOutlined,
  FilePdfOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Step } = Steps;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    // Simulate fetching orders - replace with actual API call
    setLoading(true);
    try {
      // This is a placeholder for the API call
      // const user = JSON.parse(localStorage.getItem('user') || '{}');
      // if (!user.id) throw new Error("User not found");
      // const response = await getUserOrders(user.id);
      
      // For now, using sample data
      setTimeout(() => {
        const sampleOrders = [
          {
            orderId: "ORD12345",
            orderDate: "2023-06-10T08:30:00Z",
            total: 1250000,
            status: "delivered",
            receiverName: "Nguyễn Văn A",
            receiverPhone: "0987654321",
            shippingAddress: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
            paymentMethod: "cod",
            subtotal: 1300000,
            discountAmount: 50000,
            details: [
              {
                name: "Áo thun nam cổ tròn",
                quantity: 2,
                price: 250000,
                image: "https://via.placeholder.com/80"
              },
              {
                name: "Quần jeans nam slim fit",
                quantity: 1,
                price: 750000,
                image: "https://via.placeholder.com/80"
              }
            ]
          },
          {
            orderId: "ORD12346",
            orderDate: "2023-06-15T10:15:00Z",
            total: 890000,
            status: "shipping",
            receiverName: "Nguyễn Văn A",
            receiverPhone: "0987654321",
            shippingAddress: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
            paymentMethod: "banking",
            subtotal: 890000,
            discountAmount: 0,
            details: [
              {
                name: "Áo khoác nữ dáng dài",
                quantity: 1,
                price: 890000,
                image: "https://via.placeholder.com/80"
              }
            ]
          }
        ];
        
        setOrders(sampleOrders);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải lịch sử đơn hàng");
      setLoading(false);
    }
  };
  
  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setDetailVisible(true);
  };
  
  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="warning">Chờ xác nhận</Tag>;
      case 'confirmed':
        return <Tag icon={<SyncOutlined spin />} color="processing">Đã xác nhận</Tag>;
      case 'shipping':
        return <Tag icon={<TruckOutlined />} color="blue">Đang giao hàng</Tag>;
      case 'delivered':
        return <Tag icon={<CheckCircleOutlined />} color="success">Đã giao hàng</Tag>;
      case 'cancelled':
        return <Tag color="error">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };
  
  const getOrderStatusStep = (status) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'shipping':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return 4;
      default:
        return 0;
    }
  };
  
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <span className="font-medium">#{text}</span>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (amount) => (
        <span className="font-medium">
          {amount.toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showOrderDetail(record)}
            className="text-blue-500 hover:text-blue-700"
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <Title level={4} className="mb-6">Đơn hàng của tôi</Title>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : orders.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-center">
              <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
              <Link to="/products">
                <Button type="primary" icon={<ShoppingOutlined />} className="bg-verdigris-500 hover:bg-verdigris-600">
                  Mua sắm ngay
                </Button>
              </Link>
            </div>
          }
        />
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          pagination={{ pageSize: 10 }}
          className="border border-gray-200 rounded-lg"
        />
      )}
      
      <Modal
        title={<div className="text-lg">Chi tiết đơn hàng {selectedOrder?.orderId && `#${selectedOrder.orderId}`}</div>}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button 
            key="download" 
            icon={<FilePdfOutlined />}
            onClick={() => message.info("Tính năng tải hóa đơn đang được phát triển")}
          >
            Tải hóa đơn
          </Button>,
          <Button 
            key="close" 
            onClick={() => setDetailVisible(false)}
          >
            Đóng
          </Button>
        ]}
        width={800}
      >
        {detailLoading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : selectedOrder && (
          <div>
            <div className="mb-6">
              <Steps
                current={getOrderStatusStep(selectedOrder.status)}
                status={selectedOrder.status === 'cancelled' ? 'error' : 'process'}
                items={[
                  {
                    title: 'Đặt hàng',
                    icon: <ShoppingOutlined />,
                  },
                  {
                    title: 'Xác nhận',
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: 'Vận chuyển',
                    icon: <TruckOutlined />,
                  },
                  {
                    title: 'Giao hàng',
                    icon: <CheckCircleOutlined />,
                  }
                ]}
              />
              {selectedOrder.status === 'cancelled' && (
                <div className="text-center mt-2 text-red-500">
                  Đơn hàng đã bị hủy
                </div>
              )}
            </div>
            
            <Divider />
            
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item label="Mã đơn hàng">#{selectedOrder.orderId}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedOrder.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {selectedOrder.paymentMethod === 'cod' 
                  ? 'Thanh toán khi nhận hàng (COD)' 
                  : selectedOrder.paymentMethod === 'banking'
                    ? 'Chuyển khoản ngân hàng'
                    : 'Thanh toán online'}
              </Descriptions.Item>
            </Descriptions>
            
            <div className="my-4">
              <div className="font-medium flex items-center mb-2">
                <EnvironmentOutlined className="mr-2" /> Địa chỉ nhận hàng
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">{selectedOrder.receiverName}</div>
                <div>{selectedOrder.receiverPhone}</div>
                <div>{selectedOrder.shippingAddress}</div>
              </div>
            </div>
            
            <Divider />
            
            <div className="mb-4">
              <div className="font-medium mb-3">Chi tiết sản phẩm</div>
              <div className="space-y-3">
                {selectedOrder.details && selectedOrder.details.map((item, index) => (
                  <div key={index} className="flex items-start py-3 border-b">
                    <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 mr-3">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingOutlined style={{ fontSize: 24 }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-500 text-sm">
                        SL: {item.quantity} x {item.price?.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>
                    <div className="font-medium">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Tạm tính:</span>
                <span>{selectedOrder.subtotal?.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Giảm giá:</span>
                <span>-{selectedOrder.discountAmount?.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <span>Tổng cộng:</span>
                <span className="text-red-600">{selectedOrder.total?.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;