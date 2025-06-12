import React, { useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  Modal,
  Avatar,
  message,
} from "antd";
import {
  PlusOutlined,
  TagOutlined,
  ExportOutlined,
  ImportOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/admin/SideBar";
import AdminHeader from "../../components/admin/Header";
import AttributeTypeTable from "../../components/admin/attribute_types/AttributeTypeTable";
import AttributeTypeForm from "../../components/admin/attribute_types/AttributeTypeForm";

import useAttributeType from "../../hooks/useAttributeType";
import getNotificationItems from "../../components/admin/NotificationItems";
import AttributeTypeFilter from "../../components/admin/attribute_types/AttributeTypeFilters";

const { Content } = Layout;
const { Title } = Typography;

const AttributeTypePage = () => {
  const {
    attributeTypes,
    loading,
    pagination,
    fetchAttributeTypes,
    createAttributeType,
    updateAttributeType,
    deleteAttributeType,
    handleTableChange,
  } = useAttributeType();

  const [showForm, setShowForm] = useState(false);
  const [editingAttributeType, setEditingAttributeType] = useState(null);
  const [filters, setFilters] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Get notification items
  const notificationItems = getNotificationItems();

  // Handle form operations
  const handleCreate = () => {
    setEditingAttributeType(null);
    setShowForm(true);
  };

  const handleEdit = (attributeType) => {
    console.log("Editing attribute type:", attributeType);
    setEditingAttributeType(attributeType);
    setShowForm(true);
  };

  const handleView = (attributeType) => {
    Modal.info({
      title: (
        <Space>
          <Avatar
            icon={<TagOutlined />}
            style={{ backgroundColor: "#fa8c16" }}
          />
          <span>Chi tiết loại thuộc tính</span>
        </Space>
      ),
      width: 600,
      content: (
        <div className="mt-4">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="bg-slate-50 p-4 rounded-lg">
                <Title level={4} className="mb-3">
                  {attributeType.name}
                </Title>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title="ID loại thuộc tính"
                      value={attributeType.attrTypeId || attributeType.id}
                      formatter={(value) => (
                        <span className="text-orange-600">#{value}</span>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Trạng thái"
                      value={
                        attributeType.status === "active"
                          ? "Hoạt động"
                          : "Ngừng hoạt động"
                      }
                      formatter={(value) => (
                        <span
                          className={
                            attributeType.status === "active"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {value}
                        </span>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Ngày tạo"
                      value={
                        attributeType.createdAt
                          ? new Date(
                              attributeType.createdAt
                            ).toLocaleDateString("vi-VN")
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

  const handleDelete = async (attributeTypeId) => {
    try {
      await deleteAttributeType(attributeTypeId);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa loại thuộc tính");
    }
  };

  const handleStatusChange = async (attributeTypeId, isActive) => {
    try {
      // Tìm attribute type trong danh sách để lấy thông tin đầy đủ
      const currentAttributeType = attributeTypes.find(
        (attributeType) =>
          (attributeType.attrTypeId || attributeType.id) === attributeTypeId
      );

      if (!currentAttributeType) {
        throw new Error("Không tìm thấy thông tin loại thuộc tính");
      }

      // Chuẩn bị dữ liệu đầy đủ cho API
      const updateData = {
        ...currentAttributeType,
        status: isActive ? "active" : "inactive",
      };

      await updateAttributeType(attributeTypeId, updateData);
      message.success(
        `${isActive ? "Kích hoạt" : "Ngừng hoạt động"} loại thuộc tính thành công`
      );
      fetchAttributeTypes(filters);
    } catch (error) {
      console.error("Status change error:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };
  const handleFormSubmit = async (
    attributeTypeData,
    attributeTypeId = null
  ) => {
    try {
      console.log("Form submit:", { attributeTypeData, attributeTypeId });

      if (attributeTypeId) {
        await updateAttributeType(attributeTypeId, attributeTypeData);
      } else {
        await createAttributeType(attributeTypeData);
      }
      setShowForm(false);
      setEditingAttributeType(null);
    } catch (error) {
      console.error("Form submit error:", error);
      message.error("Có lỗi xảy ra khi lưu loại thuộc tính");
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchAttributeTypes(newFilters);
  };

  const handleResetFilter = () => {
    setFilters({});
    fetchAttributeTypes();
  };

  const handleExport = () => {
    message.info("Tính năng xuất dữ liệu đang được phát triển");
  };

  const handleImport = () => {
    message.info("Tính năng nhập dữ liệu đang được phát triển");
  };

  // Calculate statistics
  const totalAttributeTypes = attributeTypes.length;
  const activeAttributeTypes = attributeTypes.filter(
    (attr) => attr.status === "active"
  ).length;
  const inactiveAttributeTypes = attributeTypes.filter(
    (attr) => attr.status === "inactive"
  ).length;

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
          <div className="bg-white p-6 rounded-lg mb-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Title level={2} className="mb-2 text-slate-800">
                  Quản lý loại thuộc tính
                </Title>
                <p className="text-slate-600 mb-0">
                  Quản lý các loại thuộc tính sản phẩm như kích thước mặt, chất
                  liệu dây, ...
                </p>
              </div>
              <Space>
                <Button
                  icon={<ImportOutlined />}
                  onClick={handleImport}
                  className="border-slate-300 hover:border-orange-400"
                >
                  Nhập dữ liệu
                </Button>
                <Button
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                  className="border-slate-300 hover:border-orange-400"
                >
                  Xuất dữ liệu
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                  className="bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700"
                >
                  Thêm loại thuộc tính
                </Button>
              </Space>
            </div>

            {/* Statistics */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Card
                  size="small"
                  bordered={false}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Statistic
                    title="Tổng loại thuộc tính"
                    value={totalAttributeTypes}
                    prefix={<TagOutlined />}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card
                  size="small"
                  bordered={false}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Statistic
                    title="Đang hoạt động"
                    value={activeAttributeTypes}
                    prefix={<TagOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card
                  size="small"
                  bordered={false}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Statistic
                    title="Ngừng hoạt động"
                    value={inactiveAttributeTypes}
                    prefix={<TagOutlined />}
                    valueStyle={{ color: "#f5222d" }}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          {/* Filter */}
          <AttributeTypeFilter
            onFilter={handleFilter}
            onReset={handleResetFilter}
            loading={loading}
          />

          {/* Table */}
          <AttributeTypeTable
            attributeTypes={attributeTypes}
            loading={loading}
            pagination={pagination}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onTableChange={handleTableChange}
            onStatusChange={handleStatusChange}
          />

          {/* Form Modal */}
          <AttributeTypeForm
            visible={showForm}
            attributeType={editingAttributeType}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingAttributeType(null);
            }}
            loading={loading}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AttributeTypePage;
