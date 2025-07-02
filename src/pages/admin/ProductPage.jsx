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
import axios from "axios";
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
                      value={product.remainQuantity || 0}
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
      console.log("Form submit with:", {
        productId,
        isFormData: productData instanceof FormData,
      });

      if (productId) {
        // Chế độ chỉnh sửa - GỬI QUA HOOK THAY VÌ AXIOS TRỰC TIẾP
        console.log("Updating product via hook...");
        await updateProduct(productId, productData);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        // Chế độ tạo mới
        await createProduct(productData);
        message.success("Tạo sản phẩm thành công!");
      }

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Có lỗi xảy ra khi lưu sản phẩm: " + (error.message || ""));
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
    (p) => p.active || p.active === "false"
  ).length;
  const outOfStockProducts = products.filter(
    (p) => !p.remainQuantity || p.remainQuantity === 0
  ).length;
  const totalValue = products.reduce((sum, p) => {
    const quantity = p.remainQuantity || 0;
    const price = p.price || 0;
    return sum + (price * quantity);
  }, 0);

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
              <Breadcrumb.Item>Quản lý sản phẩm</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="bg-white p-6 rounded-lg mb-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Title level={2} className="mb-2 text-slate-800">
                  Quản lý sản phẩm
                </Title>
                <p className="text-slate-600 mb-0">
                  Quản lý toàn bộ sản phẩm trong cửa hàng
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
                  Thêm sản phẩm
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
                    title="Tổng sản phẩm"
                    value={totalProducts}
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
                    title="Đang hoạt động"
                    value={activeProducts}
                    prefix={<InboxOutlined />}
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
                    title="Hết hàng"
                    value={outOfStockProducts}
                    prefix={<ExclamationCircleOutlined />}
                    valueStyle={{ color: "#f5222d" }}
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
          <div className="bg-white border border-slate-200 rounded-lg mb-4 shadow-sm">
            <ProductFilters
              categories={categories}
              brands={brands}
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
