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
} from "antd";
import {
  PlusOutlined,
  ExportOutlined,
  ImportOutlined,
  ShoppingOutlined,
  DollarOutlined,
  InboxOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductFilters from "../../components/admin/products/ProductFilters";
import ProductTable from "../../components/admin/products/ProductTable";
import ProductForm from "../../components/admin/products/ProductForm";
import useProducts from "../../hooks/useProducts";
import getNotificationItems from "../../components/admin/NotificationItems";
import AdminHeader from "../../components/admin/Header";
import Sidebar from "../../components/admin/SideBar";

const { Content } = Layout;
const { Title } = Typography;

const ProductPage = () => {
  const {
    products,
    categories,
    brands,
    loading,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    handleTableChange,
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Lấy dữ liệu thông báo
  const notificationItems = getNotificationItems();

  // Handle form operations
  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleView = (product) => {
    Modal.info({
      title: "Chi tiết sản phẩm",
      width: 800,
      content: (
        <div className="mt-4">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <img
                src={product.imageUrl || "/assets/images/products/default.jpg"}
                alt={product.name}
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Col>
            <Col span={16}>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <Title level={4}>{product.name}</Title>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Statistic
                      title="Giá bán"
                      value={product.price}
                      suffix="₫"
                      precision={0}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Tồn kho"
                      value={product.stockQuantity || 0}
                      suffix="sản phẩm"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Danh mục"
                      value={product.category?.name || product.category}
                      formatter={(value) => (
                        <span className="text-blue-600">{value}</span>
                      )}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Thương hiệu"
                      value={product.brand?.name || product.brand}
                      formatter={(value) => (
                        <span className="text-green-600">{value}</span>
                      )}
                    />
                  </Col>
                </Row>
              </Space>
            </Col>
          </Row>
        </div>
      ),
    });
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleFormSubmit = async (productData, productId = null) => {
    try {
      if (productId) {
        await updateProduct(productId, productData);
      } else {
        await createProduct(productData);
      }
      setShowForm(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  const handleStatusChange = async (productId, isActive) => {
    try {
      await updateProduct(productId, { isActive });
      message.success(
        `${isActive ? "Kích hoạt" : "Ngừng bán"} sản phẩm thành công`
      );
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handleResetFilter = () => {
    setFilters({});
    fetchProducts();
  };

  const handleExport = () => {
    message.info("Tính năng xuất dữ liệu đang được phát triển");
  };

  const handleImport = () => {
    message.info("Tính năng nhập dữ liệu đang được phát triển");
  };

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(
    (p) => p.isActive || p.status === "active"
  ).length;
  const outOfStockProducts = products.filter(
    (p) => !p.inStock || p.stockQuantity === 0
  ).length;
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * (p.stockQuantity || 0),
    0
  );

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />

      <Layout
        className="min-h-screen"
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: "margin-left 0.2s",
        }}
      >
        <AdminHeader
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
          notificationItems={notificationItems}
          className="z-50"
        />

        <Content className="m-4 p-4 bg-white rounded-lg">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Quản lý sản phẩm</Breadcrumb.Item>
          </Breadcrumb>

          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Title level={2} className="mb-2">
                  Quản lý sản phẩm
                </Title>
                <p className="text-gray-600">
                  Quản lý toàn bộ sản phẩm trong cửa hàng
                </p>
              </div>
              <Space>
                <Button icon={<ImportOutlined />} onClick={handleImport}>
                  Nhập dữ liệu
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExport}>
                  Xuất dữ liệu
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Thêm sản phẩm
                </Button>
              </Space>
            </div>

            {/* Statistics */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" bordered={false} className="shadow-sm">
                  <Statistic
                    title="Tổng sản phẩm"
                    value={totalProducts}
                    prefix={<ShoppingOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" bordered={false} className="shadow-sm">
                  <Statistic
                    title="Đang bán"
                    value={activeProducts}
                    prefix={<InboxOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" bordered={false} className="shadow-sm">
                  <Statistic
                    title="Hết hàng"
                    value={outOfStockProducts}
                    prefix={<ExclamationCircleOutlined />}
                    valueStyle={{ color: "#f5222d" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" bordered={false} className="shadow-sm">
                  <Statistic
                    title="Tổng giá trị kho"
                    value={totalValue}
                    prefix={<DollarOutlined />}
                    suffix="₫"
                    precision={0}
                    valueStyle={{ color: "#722ed1" }}
                    formatter={(value) => `${value.toLocaleString()}`}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          {/* Filters */}
          <ProductFilters
            categories={categories}
            brands={brands}
            onFilter={handleFilter}
            onReset={handleResetFilter}
            loading={loading}
          />

          {/* Table */}
          <Card bordered={false} className="shadow-sm">
            <ProductTable
              products={products}
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
          <ProductForm
            visible={showForm}
            onCancel={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
            product={editingProduct}
            categories={categories}
            brands={brands}
            loading={loading}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProductPage;
