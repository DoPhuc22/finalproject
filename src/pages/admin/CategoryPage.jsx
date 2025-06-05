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
} from "antd";
import {
  PlusOutlined,
  ExportOutlined,
  ImportOutlined,
  AppstoreOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import CategoryFilters from "../../components/admin/categories/CategoryFilters";
import CategoryTable from "../../components/admin/categories/CategoryTable";
import CategoryForm from "../../components/admin/categories/CategoryForm";
import useCategory from "../../hooks/useCategory";
import getNotificationItems from "../../components/admin/NotificationItems";
import AdminHeader from "../../components/admin/Header";
import Sidebar from "../../components/admin/SideBar";

const { Content } = Layout;
const { Title } = Typography;

const CategoryPage = () => {
  const {
    categories,
    loading,
    pagination,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    handleTableChange,
  } = useCategory();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filters, setFilters] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Lấy dữ liệu thông báo
  const notificationItems = getNotificationItems();

  // Handle form operations
  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    console.log("Editing category:", category); // Debug log
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleView = (category) => {
    Modal.info({
      title: (
        <Space>
          <Avatar
            icon={<AppstoreOutlined />}
            style={{ backgroundColor: category.color || "#1890ff" }}
          />
          <span>Chi tiết danh mục</span>
        </Space>
      ),
      width: 600,
      content: (
        <div className="mt-4">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="bg-slate-50 p-4 rounded-lg">
                <Title level={4} className="mb-3">
                  {category.name}
                </Title>
                <p className="text-gray-600 mb-4">
                  {category.description || "Chưa có mô tả"}
                </p>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title="ID danh mục"
                      value={category.categoryId || category.id}
                      formatter={(value) => (
                        <span className="text-blue-600">#{value}</span>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Ngày tạo"
                      value={
                        category.createdAt
                          ? new Date(category.createdAt).toLocaleDateString(
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

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa danh mục");
    }
  };

  // Fix handleFormSubmit - thay đổi thứ tự tham số
  const handleFormSubmit = async (categoryData, categoryId = null) => {
    try {
      console.log("Form submit:", { categoryData, categoryId }); // Debug log

      if (categoryId) {
        // Edit mode - truyền categoryId và categoryData
        await updateCategory(categoryId, categoryData);
      } else {
        // Create mode - chỉ truyền categoryData
        await createCategory(categoryData);
      }
      setShowForm(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Form submit error:", error);
      message.error("Có lỗi xảy ra khi lưu danh mục");
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchCategories(newFilters);
  };

  const handleResetFilter = () => {
    setFilters({});
    fetchCategories();
  };

  const handleExport = () => {
    message.info("Tính năng xuất dữ liệu đang được phát triển");
  };

  const handleImport = () => {
    message.info("Tính năng nhập dữ liệu đang được phát triển");
  };

  // Calculate statistics
  const totalCategories = categories.length;

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
              <Breadcrumb.Item>Quản lý danh mục</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="bg-white p-6 rounded-lg mb-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Title level={2} className="mb-2 text-slate-800">
                  Quản lý danh mục
                </Title>
                <p className="text-slate-600 mb-0">
                  Quản lý toàn bộ danh mục sản phẩm trong cửa hàng
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
                  Thêm danh mục
                </Button>
              </Space>
            </div>

            {/* Statistics */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={12}>
                <Card
                  size="small"
                  bordered={false}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Statistic
                    title="Tổng danh mục"
                    value={totalCategories}
                    prefix={<AppstoreOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-lg mb-4 shadow-sm">
            <CategoryFilters
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
            <CategoryTable
              categories={categories}
              loading={loading}
              pagination={pagination}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onTableChange={handleTableChange}
            />
          </Card>

          {/* Form Modal */}
          <CategoryForm
            visible={showForm}
            onCancel={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
            onSubmit={handleFormSubmit}
            category={editingCategory}
            loading={loading}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CategoryPage;
