import React, { useState } from "react";
import {
  Table,
  Space,
  Button,
  Typography,
  Popconfirm,
  Tooltip,
  Tag,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TagOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const AttributeTypeTable = ({
  attributeTypes = [],
  loading = false,
  pagination = {},
  onEdit,
  onDelete,
  onView,
  onTableChange,
  onStatusChange,
}) => {
  const [switchLoadingStates, setSwitchLoadingStates] = useState({});
  const handleStatusChange = async (attrTypeId, checked) => {
    try {
      // Set loading state for this specific switch
      setSwitchLoadingStates((prev) => ({
        ...prev,
        [attrTypeId]: true,
      }));

      console.log("Table status change:", { attrTypeId, checked }); // Debug log

      if (onStatusChange) {
        await onStatusChange(attrTypeId, checked);
      }
    } catch (error) {
      console.error("Error changing status:", error);
    } finally {
      // Clear loading state for this specific switch
      setSwitchLoadingStates((prev) => ({
        ...prev,
        [attrTypeId]: false,
      }));
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "attrTypeId",
      key: "attrTypeId",
      width: 80,
      render: (id, record) => (
        <Text code className="text-orange-600 text-lg">
          #{record.attrTypeId || record.id}
        </Text>
      ),
    },
    {
      title: "Thông tin loại thuộc tính",
      key: "info",
      render: (_, record) => (
        <div>
          <Text strong className="text-base mb-1 items-center">
            <TagOutlined className="mr-2 text-orange-500" />
            {record.name}
          </Text>
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
        const attrTypeId = record.attrTypeId || record.id;
        const isLoading = switchLoadingStates[attrTypeId] || false;

        return (
          <div className="text-center">
            <Popconfirm
              title={
                isActive ? "Xác nhận ngừng hoạt động" : "Xác nhận kích hoạt"
              }
              description={
                isActive
                  ? "Loại thuộc tính sẽ được chuyển sang trạng thái ngừng hoạt động. Bạn có chắc chắn?"
                  : "Loại trạng thái sẽ được kích hoạt lại. Bạn có chắc chắn?"
              }
              onConfirm={() => handleStatusChange(attrTypeId, !isActive)}
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
              description="Bạn có chắc chắn muốn xóa loại thuộc tính này? Hành động này không thể hoàn tác."
              onConfirm={() => onDelete(record.attrTypeId || record.id)}
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
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <Table
        columns={columns}
        dataSource={attributeTypes}
        loading={loading}
        pagination={{
          ...pagination,
          className: "px-4 py-3 bg-slate-50",
        }}
        onChange={onTableChange}
        rowKey={(record) => record.attrTypeId || record.id}
        scroll={{ x: 800 }}
        className="custom-table"
        size="middle"
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
      />
    </div>
  );
};

export default AttributeTypeTable;
