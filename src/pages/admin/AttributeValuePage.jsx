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
  Breadcrumb,
} from "antd";
import {
  PlusOutlined,
  AppstoreOutlined,
  FilterOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/SideBar";
import AttributeValueForm from "../../components/admin/attribute_values/AttributeValueForm";
import AttributeValueFilters from "../../components/admin/attribute_values/AttributeValueFilters";
import useAttributeValue from "../../hooks/useAttributeValue";
import getNotificationItems from "../../components/admin/NotificationItems";
import AdminHeader from "../../components/admin/Header";
import AttributeValueTable from "../../components/admin/attribute_values/AttributeValueTabe";

const { Content } = Layout;
const { Title } = Typography;

const AttributeValuePage = () => {
  const {
    attributeValues,
    products,
    attributeTypes,
    loading,
    pagination,
    fetchAttributeValues,
    createAttributeValue,
    updateAttributeValue,
    deleteAttributeValue,
    handleTableChange,
  } = useAttributeValue();

  const [showForm, setShowForm] = useState(false);
  const [editingAttributeValue, setEditingAttributeValue] = useState(null);
  const [filters, setFilters] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Get notification items
  const notificationItems = getNotificationItems();

  // Handle form operations
  const handleCreate = () => {
    setEditingAttributeValue(null);
    setShowForm(true);
  };

  const handleEdit = (attributeValue) => {
    setEditingAttributeValue(attributeValue);
    setShowForm(true);
  };

  const handleDelete = async (attributeValueId) => {
    try {
      await deleteAttributeValue(attributeValueId);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa thuộc tính");
    }
  };

  const handleFormSubmit = async (data, attributeValueId = null) => {
    try {
      if (attributeValueId) {
        await updateAttributeValue(attributeValueId, data);
      } else {
        await createAttributeValue(data);
      }
      setShowForm(false);
      setEditingAttributeValue(null);
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu thuộc tính");
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchAttributeValues(newFilters);
  };

  const handleResetFilter = () => {
    setFilters({});
    fetchAttributeValues();
  };

  const handleStatusChange = async (id, status) => {
    try {
      // Find the attribute value to get its product_id
      const attrValue = attributeValues.find(
        (item) => item.attr_value_id === id || item.attrValueId === id
      );

      if (!attrValue) {
        throw new Error("Cannot find attribute value");
      }

      // Pass the complete data for the update
      await updateAttributeValue(id, {
        product_id: attrValue.product_id,
        attr_type_id: attrValue.attr_type_id,
        value: attrValue.value,
        status: status,
      });

      message.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Status change error:", error);
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  // Calculate statistics
  const totalAttributeValues = attributeValues.length;
  const activeAttributeValues = attributeValues.filter(
    (item) => item.status === "active"
  ).length;
  const inactiveAttributeValues = attributeValues.filter(
    (item) => item.status === "inactive"
  ).length;
  const uniqueProducts = new Set(
    attributeValues.map((item) => item.product_id)
  ).size;

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
              <Breadcrumb.Item>Quản lý giá trị thuộc tính</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="bg-white p-6 rounded-lg mb-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Title level={2} className="mb-2 text-slate-800">
                  Quản lý giá trị thuộc tính
                </Title>
                <p className="text-slate-600 mb-0">
                  Quản lý các giá trị thuộc tính của sản phẩm trong hệ thống
                </p>
              </div>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                >
                  Thêm giá trị thuộc tính
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
                    title="Tổng thuộc tính"
                    value={totalAttributeValues}
                    prefix={<TagsOutlined />}
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
                    value={activeAttributeValues}
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
                    title="Không hoạt động"
                    value={inactiveAttributeValues}
                    prefix={<CloseCircleOutlined />}
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
                    title="Sản phẩm liên quan"
                    value={uniqueProducts}
                    prefix={<AppstoreOutlined />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          {/* Filter */}
          <AttributeValueFilters
            products={products}
            attributeTypes={attributeTypes}
            onFilter={handleFilter}
            onReset={handleResetFilter}
            loading={loading}
          />

          {/* Table */}
          <AttributeValueTable
            attributeValues={attributeValues}
            products={products}
            attributeTypes={attributeTypes}
            loading={loading}
            pagination={pagination}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTableChange={handleTableChange}
            onStatusChange={handleStatusChange}
          />

          {/* Form Modal */}
          <AttributeValueForm
            visible={showForm}
            attributeValue={editingAttributeValue}
            products={products}
            attributeTypes={attributeTypes}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingAttributeValue(null);
            }}
            loading={loading}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AttributeValuePage;