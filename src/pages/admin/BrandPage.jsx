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
  TrademarkOutlined,
  TagOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import BrandFilters from "../../components/admin/brands/BrandFilters";
import BrandTable from "../../components/admin/brands/BrandTable";
import BrandForm from "../../components/admin/brands/BrandForm";
import useBrand from "../../hooks/useBrand";
import getNotificationItems from "../../components/admin/NotificationItems";
import AdminHeader from "../../components/admin/Header";
import Sidebar from "../../components/admin/SideBar";

const { Content } = Layout;
const { Title } = Typography;

const BrandPage = () => {
  const {
    brands,
    loading,
    pagination,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    handleTableChange,
  } = useBrand();

  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [filters, setFilters] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Lấy dữ liệu thông báo
  const notificationItems = getNotificationItems();

  // Handle form operations
  const handleCreate = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const handleEdit = (brand) => {
    console.log("Editing brand:", brand); // Debug log
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleView = (brand) => {
    Modal.info({
      title: (
        <Space>
          <Avatar
            icon={<TrademarkOutlined />}
            style={{ backgroundColor: "#722ed1" }}
          />
          <span>Chi tiết nhãn hàng</span>
        </Space>
      ),
      width: 600,
      content: (
        <div className="mt-4">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="bg-slate-50 p-4 rounded-lg">
                <Title level={4} className="mb-3">
                  {brand.name}
                  <Tag
                    color={brand.status === "active" ? "success" : "error"}
                    icon={
                      brand.status === "active" ? (
                        <CheckCircleOutlined />
                      ) : (
                        <StopOutlined />
                      )
                    }
                    className="ml-2"
                  >
                    {brand.status === "active"
                      ? "Hoạt động"
                      : "Ngừng hoạt động"}
                  </Tag>
                </Title>
                <p className="text-gray-600 mb-4">
                  {brand.description || "Chưa có mô tả"}
                </p>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title="ID nhãn hàng"
                      value={brand.brandId || brand.id}
                      formatter={(value) => (
                        <span className="text-purple-600">#{value}</span>
                      )}
                    />
                  </Col>

                  <Col span={8}>
                    <Statistic
                      title="Ngày tạo"
                      value={
                        brand.createdAt
                          ? new Date(brand.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "-"
                      }
                      formatter={(value) => (
                        <span className="text-gray-600">{value}</span>
                      )}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      ),
    });
  };

  const handleDelete = async (brandId) => {
    try {
      await deleteBrand(brandId);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa nhãn hàng");
    }
  };

  const handleStatusChange = async (brandId, isActive) => {
    try {
      // Tìm brand trong danh sách để lấy thông tin đầy đủ
      const currentBrand = brands.find(
        (brand) => (brand.brandId || brand.id) === brandId
      );

      if (!currentBrand) {
        throw new Error("Không tìm thấy thông tin nhãn hàng");
      }

      // Chuẩn bị dữ liệu đầy đủ cho API
      const updateData = {
        name: currentBrand.name,
        description: currentBrand.description,
        status: isActive ? "active" : "inactive",
      };

      await updateBrand(brandId, updateData);
      message.success(
        `${isActive ? "Kích hoạt" : "Ngừng hoạt động"} nhãn hàng thành công`
      );
    } catch (error) {
      console.error("Status change error:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const handleFormSubmit = async (brandData, brandId = null) => {
    try {
      if (brandId) {
        await updateBrand(brandId, brandData);
      } else {
        await createBrand(brandData);
      }
      setShowForm(false);
      setEditingBrand(null);
    } catch (error) {
      console.error("Form submit error:", error);
      message.error("Có lỗi xảy ra khi lưu nhãn hàng");
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchBrands(newFilters);
  };

  const handleResetFilter = () => {
    setFilters({});
    fetchBrands();
  };

  const handleExport = () => {
    message.info("Tính năng xuất dữ liệu đang được phát triển");
  };

  const handleImport = () => {
    message.info("Tính năng nhập dữ liệu đang được phát triển");
  };

  // Calculate statistics
  const totalBrands = brands.length;
  const activeBrands = brands.filter((b) => b.status === "active").length;
  const inactiveBrands = totalBrands - activeBrands;

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
              <Breadcrumb.Item>Quản lý nhãn hàng</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="bg-white p-6 rounded-lg mb-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Title level={2} className="mb-2 text-slate-800">
                  Quản lý nhãn hàng
                </Title>
                <p className="text-slate-600 mb-0">
                  Quản lý toàn bộ nhãn hàng sản phẩm trong cửa hàng
                </p>
              </div>
              <Space>
                <Button
                  icon={<ImportOutlined />}
                  onClick={handleImport}
                  className="border-slate-300 hover:border-purple-400"
                >
                  Nhập dữ liệu
                </Button>
                <Button
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                  className="border-slate-300 hover:border-purple-400"
                >
                  Xuất dữ liệu
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                  className="bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700"
                >
                  Thêm nhãn hàng
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
                    title="Tổng nhãn hàng"
                    value={totalBrands}
                    prefix={<TrademarkOutlined />}
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
                    title="Đang hoạt động"
                    value={activeBrands}
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
                    value={inactiveBrands}
                    prefix={<StopOutlined />}
                    valueStyle={{ color: "#f5222d" }}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-lg mb-4 shadow-sm">
            <BrandFilters
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
            <BrandTable
              brands={brands}
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
          <BrandForm
            visible={showForm}
            onCancel={() => {
              setShowForm(false);
              setEditingBrand(null);
            }}
            onSubmit={handleFormSubmit}
            brand={editingBrand}
            loading={loading}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BrandPage;
