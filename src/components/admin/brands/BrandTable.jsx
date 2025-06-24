import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Popconfirm,
  Tooltip,
  Avatar,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TrademarkOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const BrandTable = ({
  brands = [],
  loading = false,
  pagination = {},
  onEdit,
  onDelete,
  onView,
  onTableChange,
  onStatusChange,
}) => {
  const [switchLoadingStates, setSwitchLoadingStates] = useState({});

  const handleStatusChange = async (brandId, checked) => {
    try {
      // Set loading state for this specific switch
      setSwitchLoadingStates((prev) => ({
        ...prev,
        [brandId]: true,
      }));

      console.log("Table status change:", { brandId, checked }); // Debug log

      if (onStatusChange) {
        await onStatusChange(brandId, checked);
      }
    } catch (error) {
      console.error("Error changing status:", error);
    } finally {
      // Clear loading state for this specific switch
      setSwitchLoadingStates((prev) => ({
        ...prev,
        [brandId]: false,
      }));
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "brandId",
      key: "brandId",
      width: 80,
      render: (id, record) => (
        <Text code className="text-purple-600 text-lg">
          #{record.brandId || record.id}
        </Text>
      ),
    },
    {
      title: "Thông tin nhãn hàng",
      key: "info",
      render: (_, record) => (
        <div>
          <Text strong className="text-base mb-1">
            {record.name}
          </Text>
          <Paragraph
            type="secondary"
            className="mb-2 text-sm"
            ellipsis={{ rows: 2, tooltip: record.description }}
          >
            {record.description || "Chưa có mô tả"}
          </Paragraph>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status, record) => {
        const isActive = status === "active";
        const brandId = record.brandId || record.id;
        const isLoading = switchLoadingStates[brandId] || false;

        return (
          <div className="text-center">
            <Popconfirm
              title={
                isActive ? "Xác nhận ngừng hoạt động" : "Xác nhận kích hoạt"
              }
              description={
                isActive
                  ? "Nhãn hàng sẽ được chuyển sang trạng thái ngừng hoạt động. Bạn có chắc chắn?"
                  : "Nhãn hàng sẽ được kích hoạt lại. Bạn có chắc chắn?"
              }
              onConfirm={() => handleStatusChange(brandId, !isActive)}
              okText={isActive ? "Ngừng hoạt động" : "Kích hoạt"}
              cancelText="Hủy"
              okType={isActive ? "danger" : "primary"}
            >
              <Switch
                checked={isActive}
                checkedChildren="Hoạt động"
                unCheckedChildren="Ngừng"
                size="small"
                loading={isLoading}
              />
            </Popconfirm>
            <div className="text-xs text-gray-500 mt-1">
              {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
            </div>
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,    
      align: "center",
      render: (date) => (
        <div className="text-center text-sm">
          {date ? new Date(date).toLocaleDateString("vi-VN") : "-"}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className="text-green-500 hover:text-green-700"
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa nhãn hàng này? Hành động này không thể hoàn tác."
              onConfirm={() => onDelete(record.brandId || record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-700"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={brands}
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} nhãn hàng`,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      onChange={onTableChange}
      rowKey={(record) => record.brandId || record.id}
      scroll={{ x: 800 }}
      size="middle"
      className="custom-table"
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row-light" : "table-row-dark"
      }
    />
  );
};

export default BrandTable;
