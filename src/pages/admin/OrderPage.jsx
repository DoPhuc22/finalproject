import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Button,
  Space,
  Typography,
  Statistic,
  Row,
  Col,
  message,
  Breadcrumb,
} from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  ExportOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/SideBar";
import AdminHeader from "../../components/admin/Header";
import OrderTable from "../../components/admin/orders/OrderTable";
import OrderFilters from "../../components/admin/orders/OrderFilters";
import useOrder from "../../hooks/useOrder";
import getNotificationItems from "../../components/admin/NotificationItems";

const { Content } = Layout;
const { Title } = Typography;

const OrderPage = () => {
  const {
    orders,
    loading,
    pagination,
    fetchOrders,
    updateStatus,
    deleteOrder,
    handleTableChange,
  } = useOrder();

  const [filters, setFilters] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    shippingOrders: 0,
    totalRevenue: 0,
  });

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Get notification items
  const notificationItems = getNotificationItems();

  // Cập nhật thống kê mỗi khi orders thay đổi
  useEffect(() => {
    calculateStatistics(orders);
  }, [orders]);

  // Hàm tính toán thống kê
  const calculateStatistics = (ordersList) => {
    // Chuẩn hóa trạng thái để xử lý cả chuỗi JSON và giá trị thông thường
    const normalizedOrders = ordersList.map(order => {
      let status = order.status;
      
      if (typeof status === 'string' && status.startsWith('{') && status.endsWith('}')) {
        try {
          const parsedStatus = JSON.parse(status);
          if (parsedStatus && parsedStatus.status) {
            status = parsedStatus.status;
          }
        } catch (error) {
          console.error("Error parsing status JSON:", error);
        }
      }
      
      return {
        ...order,
        normalizedStatus: status
      };
    });
    
    const totalOrders = normalizedOrders.length;
    const pendingOrders = normalizedOrders.filter(
      (order) => order.normalizedStatus === "pending"
    ).length;
    const deliveredOrders = normalizedOrders.filter(
      (order) => order.normalizedStatus === "delivered"
    ).length;
    const shippingOrders = normalizedOrders.filter(
      (order) => order.normalizedStatus === "shipping"
    ).length;
    
    // Chỉ tính doanh thu từ đơn hàng đã giao
    const totalRevenue = normalizedOrders
      .filter((order) => order.normalizedStatus === "delivered")
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    setStatistics({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      shippingOrders,
      totalRevenue,
    });
    
    console.log("Đã cập nhật thống kê:", {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      shippingOrders,
      totalRevenue,
    });
  };

  // Đảm bảo fetch dữ liệu khi component được tải
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle filter operations
  const handleFilter = (newFilters) => {
    console.log("Áp dụng bộ lọc mới:", newFilters);
    setFilters(newFilters);
    fetchOrders(newFilters);
  };

  const handleResetFilter = () => {
    console.log("Đặt lại bộ lọc");
    setFilters({});
    fetchOrders();
  };

  // Handle order operations
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const success = await updateStatus(orderId, newStatus);
      if (success) {
        // Cập nhật thống kê ngay sau khi cập nhật thành công
        calculateStatistics(orders);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      // Cập nhật thống kê sau khi xóa
      calculateStatistics(orders);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa đơn hàng");
    }
  };

  const handleExport = () => {
    message.info("Tính năng xuất dữ liệu đang được phát triển");
  };

  const handleImport = () => {
    message.info("Tính năng nhập dữ liệu đang được phát triển");
  };

  return (
    <Layout className="min-h-screen bg-slate-100">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />

      <Layout
        className="min-h-screen bg-slate-50"
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: "margin-left 0.2s",
        }}
      >
        <AdminHeader
          collapsed={collapsed}
          onCollapse={toggleCollapsed}
          notificationItems={notificationItems}
        />

        <Content className="p-6">
          {/* Breadcrumb */}
          <div className="bg-white p-3 rounded-lg mb-4 border border-slate-200 shadow-sm">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/admin/dashboard">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Quản lý đơn hàng</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="bg-white p-6 rounded-lg mb-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Title level={2} className="mb-2 text-slate-800">
                  Quản lý đơn hàng
                </Title>
                <p className="text-slate-600 mb-0">
                  Theo dõi và quản lý tất cả đơn hàng trong hệ thống
                </p>
              </div>
              <Space>
                <Button
                  icon={<ImportOutlined />}
                  onClick={handleImport}
                  className="border-slate-300 hover:border-blue-400"
                >
                  Nhập dữ liệu
                </Button>
                <Button
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                  className="border-slate-300 hover:border-blue-400"
                >
                  Xuất dữ liệu
                </Button>
              </Space>
            </div>

            {/* Statistics */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  size="small"
                  bordered={false}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Statistic
                    title="Tổng đơn hàng"
                    value={statistics.totalOrders}
                    prefix={<ShoppingOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  size="small"
                  bordered={false}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Statistic
                    title="Chờ xác nhận"
                    value={statistics.pendingOrders}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  size="small"
                  bordered={false}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Statistic
                    title="Đang giao hàng"
                    value={statistics.shippingOrders}
                    prefix={<TruckOutlined />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  size="small"
                  bordered={false}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Statistic
                    title="Đã giao hàng"
                    value={statistics.deliveredOrders}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Revenue Statistics */}
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} sm={12} lg={6}>
                <Card
                  size="small"
                  bordered={false}
                  className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Statistic
                    title={<span className="text-white">Tổng doanh thu</span>}
                    value={statistics.totalRevenue}
                    prefix={<DollarOutlined className="text-white" />}
                    valueStyle={{ color: "white" }}
                    formatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value)
                    }
                  />
                </Card>
              </Col>
            </Row>
          </div>

          {/* Filter */}
          <OrderFilters
            onFilter={handleFilter}
            onReset={handleResetFilter}
            loading={loading}
          />

          {/* Table */}
          <OrderTable
            orders={orders}
            loading={loading}
            pagination={pagination}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
            onTableChange={handleTableChange}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default OrderPage;