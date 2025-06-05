import React from "react";
import {
  Table,
  Space,
  Button,
  Typography,
  Popconfirm,
  Tooltip,
  Avatar,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const CategoryTable = ({
  categories = [],
  loading = false,
  pagination = {},
  onEdit,
  onDelete,
  onView,
  onTableChange,
}) => {
  const columns = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: 60,
      render: (icon, record) => (
        <Avatar
          icon={<AppstoreOutlined />}
          style={{
            backgroundColor: record.color || "#1890ff",
            color: "#fff",
          }}
        />
      ),
    },
    {
      title: "Thông tin danh mục",
      key: "info",
      render: (_, record) => (
        <div>
          <Text strong className="text-base mb-1 block">
            {record.name}
          </Text>
          <Paragraph
            type="secondary"
            className="mb-2 text-sm"
            ellipsis={{ rows: 2, tooltip: record.description }}
          >
            {record.description || "Chưa có mô tả"}
          </Paragraph>
          <Text type="secondary" className="text-xs">
            ID: {record.categoryId || record.id}
          </Text>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      sorter: true,
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
              description="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
              onConfirm={() => onDelete(record.categoryId || record.id)}
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
      dataSource={categories}
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} danh mục`,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      onChange={onTableChange}
      rowKey={(record) => record.categoryId || record.id}
      scroll={{ x: 800 }}
      size="middle"
      className="custom-table"
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row-light" : "table-row-dark"
      }
    />
  );
};

export default CategoryTable;
