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
  message,
  Form,
  Input,
  Popconfirm,
} from "antd";
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  getUserOrders,
  cancelOrderOrUpdateReceiver,
  getAllOrders,
} from "../../../services/orders";
import { getCurrentUser } from "../../../services/auth";
import { getProductImages } from "../../../services/products";

const { Title } = Typography;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editForm] = Form.useForm();

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      // Lưu userID dưới dạng string để đảm bảo so sánh chính xác sau này
      const userId = String(user.id || user.userId);
      
      if (!userId) {
        console.error("Invalid user ID received:", user);
        message.error("Không thể xác định ID người dùng");
        return;
      }
      
      // Lưu thông tin người dùng
      setCurrentUser({
        ...user,
        userId: userId // Đảm bảo luôn có userId nhất quán
      });
      
      console.log("User authenticated with ID:", userId);
      await fetchOrders(userId);
    } else {
      console.error("No user returned from getCurrentUser()");
      message.error("Không thể lấy thông tin người dùng");
    }
  } catch (error) {
    console.error("Error initializing user:", error);
    message.error("Lỗi khi tải thông tin người dùng");
  }
};

  const fetchOrders = async (userId) => {
  if (!userId) {
    console.error("fetchOrders: userId is undefined or null");
    message.error("Không thể xác định thông tin người dùng");
    setLoading(false);
    return;
  }

  setLoading(true);
  try {
    console.log("Fetching orders for user:", userId);

    let ordersData = [];

    try {
      // Try using getUserOrders first
      const response = await getUserOrders(userId);
      ordersData = response.data || response || [];
      
      // Thêm xác thực để đảm bảo chỉ lấy đơn hàng của người dùng hiện tại
      if (Array.isArray(ordersData)) {
        ordersData = ordersData.filter(order => {
          const orderUserId = order.userId || order.user_id;
          return String(orderUserId) === String(userId);
        });
      }
    } catch (apiError) {
      console.error("API error when fetching orders:", apiError);

      // Fallback: Try getAllOrders
      try {
        const allOrdersResponse = await getAllOrders();
        const allOrdersData = allOrdersResponse.data || allOrdersResponse || [];

        // Filter by userId - ÁP DỤNG SO SÁNH CHÍNH XÁC HƠN
        ordersData = allOrdersData.filter(order => {
          const orderUserId = order.userId || order.user_id;
          // Chuyển đổi sang string để so sánh chính xác
          return String(orderUserId) === String(userId);
        });
        
        console.log(`Filtered ${allOrdersData.length} orders to ${ordersData.length} for user ${userId}`);
      } catch (fallbackError) {
        console.error(
          "Fallback error when fetching all orders:",
          fallbackError
        );

        // Final fallback: Use localStorage
        const localStorageOrders = JSON.parse(
          localStorage.getItem("orders") || "[]"
        );
        
        // Áp dụng lọc chính xác với localStorage
        ordersData = localStorageOrders.filter(order => {
          const orderUserId = order.userId || order.user_id;
          return String(orderUserId) === String(userId);
        });
        
        console.log(`Using localStorage: Found ${ordersData.length} orders for user ${userId}`);
      }
    }

    // Kiểm tra lại một lần nữa để đảm bảo chỉ lấy đơn hàng của người dùng hiện tại
    if (Array.isArray(ordersData)) {
      const originalCount = ordersData.length;
      ordersData = ordersData.filter(order => {
        const orderUserId = order.userId || order.user_id;
        return String(orderUserId) === String(userId);
      });
      
      if (originalCount !== ordersData.length) {
        console.warn(`Removed ${originalCount - ordersData.length} orders that didn't belong to user ${userId}`);
      }
    }

    console.log(`Final orders data for user ${userId}:`, ordersData);

    // Sort orders by date (newest first)
    const sortedOrders = Array.isArray(ordersData)
      ? ordersData.sort(
          (a, b) =>
            new Date(b.orderDate || b.createdAt || Date.now()) -
            new Date(a.orderDate || a.createdAt || Date.now())
        )
      : [];

    setOrders(sortedOrders);
  } catch (error) {
    console.error("Error in entire fetchOrders flow:", error);
    message.error("Không thể tải lịch sử đơn hàng");
    setOrders([]);
  } finally {
    setLoading(false);
  }
};

  const getOrderDetails = async (order) => {
    if (!order) return null;

    // Đảm bảo orderDetails luôn có dữ liệu
    const details = order.details || [];

    // Lấy ảnh sản phẩm từ API cho mỗi sản phẩm trong order
    const detailsWithImages = await Promise.all(
      details.map(async (item) => {
        // Khởi tạo các giá trị mặc định
        let productId = item.productId;
        let productName = item.product?.name || item.name || "Sản phẩm";
        let imageUrl = item.product?.imageUrl || item.imageUrl || "/assets/images/products/default.jpg";
        let unitPrice = item.unitPrice || item.price || 0;
        
        try {
          // Chỉ gọi API nếu có productId
          if (productId) {
            // Lấy ảnh sản phẩm từ API
            const imagesResponse = await getProductImages(productId);
            const images = imagesResponse.data || imagesResponse || [];
            
            // Tìm ảnh chính (isPrimary = true) hoặc lấy ảnh đầu tiên
            const primaryImage = images.find(img => img.isPrimary) || images[0];
            
            if (primaryImage && primaryImage.imageUrl) {
              imageUrl = primaryImage.imageUrl;
            }
          }
        } catch (error) {
          console.error(`Error fetching images for product ${productId}:`, error);
          // Giữ nguyên URL ảnh mặc định nếu có lỗi
        }

        return {
          orderDetailId: item.orderDetailId || item.id || Math.random().toString(),
          productId,
          product: item.product || {},
          name: productName,
          imageUrl,
          quantity: item.quantity || 1,
          unitPrice,
          lineTotal:
            item.lineTotal ||
            unitPrice * (item.quantity || 1),
        };
      })
    );

    return {
      ...order,
      details: detailsWithImages,
      orderDate: order.orderDate || order.createdAt || new Date().toISOString(),
      total: order.total || 0,
      subtotal: order.subtotal || 0,
      status: order.status || "pending",
      paymentMethod: order.paymentMethod || "cod",
      receiverName: order.receiverName || "Không có thông tin",
      receiverPhone: order.receiverPhone || "Không có thông tin",
      shippingAddress: order.shippingAddress || "Không có thông tin",
    };
  };

const showOrderDetail = async (order) => {
  // Kiểm tra xem đơn hàng có thuộc về người dùng hiện tại không
  const orderUserId = String(order.userId || order.user_id);
  const currentUserId = String(currentUser?.id || currentUser?.userId);
  
  if (orderUserId !== currentUserId) {
    console.error("Attempted to view order that doesn't belong to current user");
    message.error("Bạn không có quyền xem đơn hàng này");
    return;
  }
  
  setDetailLoading(true);
  setSelectedOrder(order);
  setDetailVisible(true);
  
  try {
    // Xử lý chi tiết đơn hàng để lấy ảnh sản phẩm
    const enhancedOrder = await getOrderDetails(order);
    setSelectedOrder(enhancedOrder);
  } catch (error) {
    console.error("Error loading order details:", error);
    message.error("Có lỗi khi tải chi tiết đơn hàng");
  } finally {
    setDetailLoading(false);
  }
};

  const navigateToProductDetail = (productId) => {
    if (productId) {
      window.open(`/products/${productId}`, '_blank');
    }
  };

  const showEditForm = (order) => {
    setSelectedOrder(order);
    editForm.setFieldsValue({
      receiverName: order.receiverName,
      receiverPhone: order.receiverPhone,
      shippingAddress: order.shippingAddress,
    });
    setEditVisible(true);
  };

  const handleUpdateOrder = async (values) => {
  if (!selectedOrder) return;
  
  // Kiểm tra xem đơn hàng có thuộc về người dùng hiện tại không
  const orderUserId = String(selectedOrder.userId || selectedOrder.user_id);
  const currentUserId = String(currentUser?.id || currentUser?.userId);
  
  if (orderUserId !== currentUserId) {
    console.error("Attempted to update order that doesn't belong to current user");
    message.error("Bạn không có quyền cập nhật đơn hàng này");
    return;
  }

  try {
    setActionLoading(true);

    const updateData = {
      receiverName: values.receiverName,
      receiverPhone: values.receiverPhone,
      receiverAddress: values.shippingAddress,
    };

    console.log("Updating order:", selectedOrder.orderId, updateData);

    await cancelOrderOrUpdateReceiver(selectedOrder.orderId, updateData);

    message.success("Cập nhật thông tin đơn hàng thành công!");

    // Refresh orders list
    if (currentUser) {
      await fetchOrders(currentUser.id || currentUser.userId);
    }

    setEditVisible(false);
    editForm.resetFields();

    // Update selected order if detail modal is open
    if (detailVisible) {
      setSelectedOrder((prev) => ({
        ...prev,
        receiverName: values.receiverName,
        receiverPhone: values.receiverPhone,
        shippingAddress: values.shippingAddress,
      }));
    }
  } catch (error) {
    console.error("Error updating order:", error);
    message.error("Có lỗi xảy ra khi cập nhật thông tin đơn hàng");
  } finally {
    setActionLoading(false);
  }
};

const handleCancelOrder = async (orderId) => {
  // Tìm đơn hàng cần hủy
  const orderToCancel = orders.find(order => String(order.orderId) === String(orderId));
  
  if (!orderToCancel) {
    console.error("Order not found:", orderId);
    message.error("Không tìm thấy đơn hàng");
    return;
  }
  
  // Kiểm tra đơn hàng có thuộc về người dùng hiện tại không
  const orderUserId = String(orderToCancel.userId || orderToCancel.user_id);
  const currentUserId = String(currentUser?.id || currentUser?.userId);
  
  if (orderUserId !== currentUserId) {
    console.error("Attempted to cancel order that doesn't belong to current user");
    message.error("Bạn không có quyền hủy đơn hàng này");
    return;
  }

  try {
    setActionLoading(true);

    console.log("Cancelling order:", orderId);

    await cancelOrderOrUpdateReceiver(orderId, { cancel: true });

    message.success("Hủy đơn hàng thành công!");

    // Refresh orders list
    if (currentUser) {
      await fetchOrders(currentUser.id || currentUser.userId);
    }

    // Close modals if open
    setDetailVisible(false);
    setEditVisible(false);
  } catch (error) {
    console.error("Error cancelling order:", error);
    message.error("Có lỗi xảy ra khi hủy đơn hàng");
  } finally {
    setActionLoading(false);
  }
};

  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Chờ xác nhận
          </Tag>
        );
      case "confirmed":
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Đã xác nhận
          </Tag>
        );
      case "shipping":
        return (
          <Tag icon={<TruckOutlined />} color="blue">
            Đang giao hàng
          </Tag>
        );
      case "delivered":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã giao hàng
          </Tag>
        );
      case "cancelled":
        return <Tag color="error">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getOrderStatusStep = (status) => {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "shipping":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return 4;
      default:
        return 0;
    }
  };

  const canEditOrCancel = (order) => {
    return order.status === "pending";
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <span className="font-medium">#{text}</span>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (amount) => (
        <span className="font-medium">
          {amount?.toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "action",
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

          {canEditOrCancel(record) && (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => showEditForm(record)}
                className="text-green-500 hover:text-green-700"
              >
                Sửa
              </Button>

              <Popconfirm
                title="Hủy đơn hàng"
                description="Bạn có chắc chắn muốn hủy đơn hàng này?"
                onConfirm={() => handleCancelOrder(record.orderId)}
                okText="Hủy đơn"
                cancelText="Không"
                okType="danger"
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  loading={actionLoading}
                  className="text-red-500 hover:text-red-700"
                >
                  Hủy
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} className="mb-6">
        Đơn hàng của tôi
      </Title>

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
                <Button
                  type="primary"
                  icon={<ShoppingOutlined />}
                  className="bg-verdigris-500 hover:bg-verdigris-600"
                >
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

      {/* Detail Modal */}
      <Modal
        title={
          <div className="text-lg">
            Chi tiết đơn hàng{" "}
            {selectedOrder?.orderId && `#${selectedOrder.orderId}`}
          </div>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button
            key="download"
            icon={<FilePdfOutlined />}
            onClick={() =>
              message.info("Tính năng tải hóa đơn đang được phát triển")
            }
          >
            Tải hóa đơn
          </Button>,
          ...(selectedOrder && canEditOrCancel(selectedOrder)
            ? [
                <Button
                  key="edit"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setDetailVisible(false);
                    showEditForm(selectedOrder);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                >
                  Sửa thông tin
                </Button>,
                <Popconfirm
                  key="cancel"
                  title="Hủy đơn hàng"
                  description="Bạn có chắc chắn muốn hủy đơn hàng này?"
                  onConfirm={() => handleCancelOrder(selectedOrder.orderId)}
                  okText="Hủy đơn"
                  cancelText="Không"
                  okType="danger"
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    loading={actionLoading}
                  >
                    Hủy đơn hàng
                  </Button>
                </Popconfirm>,
              ]
            : []),
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {detailLoading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          selectedOrder && (
            <div>
              <div className="mb-6">
                <Steps
                  current={getOrderStatusStep(selectedOrder.status)}
                  status={
                    selectedOrder.status === "cancelled"
                      ? "error"
                      : "process"
                  }
                  items={[
                    {
                      title: "Đặt hàng",
                      icon: <ShoppingOutlined />,
                    },
                    {
                      title: "Xác nhận",
                      icon: <CheckCircleOutlined />,
                    },
                    {
                      title: "Vận chuyển",
                      icon: <TruckOutlined />,
                    },
                    {
                      title: "Giao hàng",
                      icon: <CheckCircleOutlined />,
                    },
                  ]}
                />
                {selectedOrder.status === "cancelled" && (
                  <div className="text-center mt-2 text-red-500">
                    Đơn hàng đã bị hủy
                  </div>
                )}
              </div>

              <Divider />

              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              >
                <Descriptions.Item label="Mã đơn hàng">
                  #{selectedOrder.orderId}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">
                  {new Date(selectedOrder.orderDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {getStatusTag(selectedOrder.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  {selectedOrder.paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : selectedOrder.paymentMethod === "banking"
                      ? "Chuyển khoản ngân hàng"
                      : selectedOrder.paymentMethod === "vnpay"
                        ? "VNPay"
                        : "Thanh toán online"}
                </Descriptions.Item>
              </Descriptions>

              <div className="my-4">
                <div className="font-medium flex items-center mb-2">
                  <EnvironmentOutlined className="mr-2" /> Địa chỉ nhận
                  hàng
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium">
                    {selectedOrder.receiverName}
                  </div>
                  <div>{selectedOrder.receiverPhone}</div>
                  <div>{selectedOrder.shippingAddress}</div>
                </div>
              </div>

              <Divider />

              <div className="mb-4">
                <div className="font-medium mb-3">Chi tiết sản phẩm</div>
                <div className="space-y-3">
                  {selectedOrder.details &&
                    selectedOrder.details.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start py-3 border-b"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 mr-3 overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/images/products/default.jpg";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingOutlined style={{ fontSize: 24 }} />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">
                            {item.productId ? (
                              <a 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigateToProductDetail(item.productId);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {item.name}
                              </a>
                            ) : (
                              item.name
                            )}
                          </div>
                          <div className="text-gray-500 text-sm">
                            SL: {item.quantity} x{" "}
                            {item.unitPrice.toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </div>
                        </div>
                        <div className="font-medium">
                          {item.lineTotal.toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                {/* <div className="flex justify-between mb-2">
                  <span>Tạm tính:</span>
                  <span>
                    {selectedOrder.subtotal?.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <Divider className="my-2" /> */}
                <div className="flex justify-between font-medium text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">
                    {selectedOrder.total?.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </Modal>

      {/* Edit Information Modal */}
      <Modal
        title="Sửa thông tin đơn hàng"
        open={editVisible}
        onCancel={() => {
          setEditVisible(false);
          editForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateOrder}>
          <Form.Item
            name="receiverName"
            label="Tên người nhận"
            rules={[
              { required: true, message: "Vui lòng nhập tên người nhận!" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên người nhận" />
          </Form.Item>

          <Form.Item
            name="receiverPhone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="shippingAddress"
            label="Địa chỉ giao hàng"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ giao hàng!" },
              { min: 10, message: "Địa chỉ phải có ít nhất 10 ký tự!" },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập địa chỉ giao hàng chi tiết"
            />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                setEditVisible(false);
                editForm.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={actionLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderHistory;