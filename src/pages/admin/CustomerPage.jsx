import React, { useState } from "react";
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
  Modal,
  Breadcrumb,
  Avatar,
  Tag,
} from "antd";
import {
  PlusOutlined,
  ExportOutlined,
  ImportOutlined,
  UserOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  StopOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import CustomerFilters from "../../components/admin/customers/CustomerFilters";
import CustomerTable from "../../components/admin/customers/CustomerTable";
import CustomerForm from "../../components/admin/customers/CustomerForm";
import useCustomer from "../../hooks/useCustomer";
import getNotificationItems from "../../components/admin/NotificationItems";
import AdminHeader from "../../components/admin/Header";
import Sidebar from "../../components/admin/SideBar";

const { Content } = Layout;
const { Title } = Typography;

const CustomerPage = () => {
  const {
    customers,
    loading,
    pagination,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    handleTableChange,
  } = useCustomer();

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [filters, setFilters] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Lấy dữ liệu thông báo
  const notificationItems = getNotificationItems();

  // Handle form operations
  const handleCreate = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    console.log("Editing customer:", customer); // Debug log
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleView = (customer) => {
    Modal.info({
      title: (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <span>Chi tiết khách hàng</span>
        </Space>
      ),
      width: 600,
      content: (
        <div className="mt-4">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Title level={4} className="mb-0">
                    {customer.name}
                  </Title>
                  <Space>
                    <Tag
                      color={customer.status === "active" ? "success" : "error"}
                      icon={
                        customer.status === "active" ? (
                          <CheckCircleOutlined />
                        ) : (
                          <StopOutlined />
                        )
                      }
                    >
                      {customer.status === "active"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"}
                    </Tag>
                  </Space>
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2 font-medium">{customer.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Điện thoại:</span>
                      <span className="ml-2 font-medium">
                        {customer.phone || "Chưa có"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Giới tính:</span>
                      <span className="ml-2 font-medium">
                        {customer.gender === "M"
                          ? "Nam"
                          : customer.gender === "F"
                            ? "Nữ"
                            : "Chưa xác định"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày tham gia:</span>
                      <span className="ml-2 font-medium">
                        {customer.joinDate
                          ? new Date(customer.joinDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title="ID khách hàng"
                      value={customer.userId || customer.id}
                      formatter={(value) => (
                        <span className="text-blue-600">#{value}</span>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Số đơn hàng"
                      value={customer.orderCount || 0}
                      suffix="đơn"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Tổng chi tiêu"
                      value={customer.totalSpent || 0}
                      formatter={(value) => (
                        <span className="text-green-600">
                          {value.toLocaleString()} VNĐ
                        </span>
                      )}
                    />
                  </Col>
                </Row> */}
              </div>
            </Col>
          </Row>
        </div>
      ),
    });
  };

  const handleDelete = async (customerId) => {
    try {
      await deleteCustomer(customerId);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa khách hàng");
    }
  };

  const handleStatusChange = async (customerId, isActive) => {
    try {
      console.log("Status change for customer:", { customerId, isActive }); // Debug log

      // Tìm customer trong danh sách để lấy thông tin đầy đủ
      const currentCustomer = customers.find(
        (customer) => (customer.userId || customer.id) === customerId
      );

      if (!currentCustomer) {
        throw new Error("Không tìm thấy thông tin khách hàng");
      }

      // Chuẩn bị dữ liệu đầy đủ cho API
      const updateData = {
        name: currentCustomer.name,
        email: currentCustomer.email,
        phone: currentCustomer.phone,
        role: currentCustomer.role,
        gender: currentCustomer.gender,
        status: isActive ? "active" : "inactive",
      };

      console.log("Update data for status change:", updateData); // Debug log

      await updateCustomer(customerId, updateData);
      message.success(
        `${isActive ? "Kích hoạt" : "Ngừng hoạt động"} khách hàng thành công`
      );
    } catch (error) {
      console.error("Status change error:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  // Fix handleFormSubmit - thay đổi thứ tự tham số
  const handleFormSubmit = async (customerData, customerId = null) => {
    try {
      console.log("Form submit:", { customerData, customerId }); // Debug log

      if (customerId) {
        // Edit mode - truyền customerId và customerData
        await updateCustomer(customerId, customerData);
      } else {
        // Create mode - chỉ truyền customerData
        await createCustomer(customerData);
      }
      setShowForm(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error("Form submit error:", error);
      message.error("Có lỗi xảy ra khi lưu khách hàng");
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchCustomers(newFilters);
  };

  const handleResetFilter = () => {
    setFilters({});
    fetchCustomers();
  };

  const handleExport = () => {
    message.info("Tính năng xuất dữ liệu đang được phát triển");
  };

  const handleImport = () => {
    message.info("Tính năng nhập dữ liệu đang được phát triển");
  };

  // Calculate statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const inactiveCustomers = customers.filter((c) => c.status === "inactive").length;
  const totalRevenue = customers.reduce(
    (sum, c) => sum + (c.totalSpent || 0),
    0
  );

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
          toggleCollapsed={toggleCollapsed}
          notificationItems={notificationItems}
        />

        <Content className="m-6">
          {/* Breadcrumb */}
          <div className="bg-white p-3 rounded-lg mb-4 border border-slate-200 shadow-sm">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/admin/dashboard">Dashboard</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Quản lý khách hàng</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="bg-white p-6 rounded-lg mb-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Title level={2} className="mb-2 text-slate-800">
                  Quản lý khách hàng
                </Title>
                <p className="text-slate-600 mb-0">
                  Quản lý toàn bộ thông tin khách hàng và theo dõi hoạt động
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
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                >
                  Thêm khách hàng
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
                    title="Tổng khách hàng"
                    value={totalCustomers}
                    prefix={<UserOutlined />}
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
                    title="Đang hoạt động"
                    value={activeCustomers}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: "#52c41a" }}
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
                    title="Ngừng hoạt động"
                    value={inactiveCustomers}
                    prefix={<StopOutlined />}
                    valueStyle={{ color: "#f5222d" }}
                  />
                </Card>
              </Col>
              {/* <Col xs={24} sm={12} lg={6}>
                <Card
                  size="small"
                  bordered={false}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Statistic
                    title="Tổng doanh thu"
                    value={totalRevenue}
                    prefix={<DollarOutlined />}
                    formatter={(value) => `${value.toLocaleString()} VNĐ`}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col> */}
            </Row>
          </div>

          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-lg mb-4 shadow-sm">
            <CustomerFilters
              onFilter={handleFilter}
              onReset={handleResetFilter}
              loading={loading}
            />
          </div>

          {/* Table */}
          <Card
            bordered={false}
            className="bg-white rounded-lg shadow-sm border border-slate-200"
          >
            <CustomerTable
              customers={customers}
              loading={loading}
              pagination={pagination}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onTableChange={handleTableChange}
              onStatusChange={handleStatusChange}
            />
          </Card>

          {/* Form Modal */}
          <CustomerForm
            visible={showForm}
            onCancel={() => {
              setShowForm(false);
              setEditingCustomer(null);
            }}
            onSubmit={handleFormSubmit}
            customer={editingCustomer}
            loading={loading}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomerPage;
