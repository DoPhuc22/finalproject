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
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const CustomerTable = ({
  customers = [],
  loading = false,
  pagination = {},
  onEdit,
  onDelete,
  onView,
  onTableChange,
  onStatusChange,
}) => {
  const [switchLoadingStates, setSwitchLoadingStates] = useState({});

  const handleStatusChange = async (customerId, checked) => {
    try {
      // Set loading state for this specific switch
      setSwitchLoadingStates((prev) => ({
        ...prev,
        [customerId]: true,
      }));

      console.log("Table status change:", { customerId, checked }); // Debug log

      if (onStatusChange) {
        await onStatusChange(customerId, checked);
      }
    } catch (error) {
      console.error("Error changing status:", error);
    } finally {
      // Clear loading state for this specific switch
      setSwitchLoadingStates((prev) => ({
        ...prev,
        [customerId]: false,
      }));
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Ngừng hoạt động";
      case "blocked":
        return "Bị khóa";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
      width: 80,
      render: (id, record) => (
        <Text code className="text-blue-600 text-lg">
          #{record.userId || record.id}
        </Text>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar
            size={40}
            icon={
              record.gender === "F" ? (
                <WomanOutlined />
              ) : record.gender === "M" ? (
                <ManOutlined />
              ) : (
                <UserOutlined />
              )
            }
            style={{
              backgroundColor:
                record.gender === "F"
                  ? "#ff69b4"
                  : record.gender === "M"
                    ? "#1890ff"
                    : "#722ed1",
              marginRight: 12,
            }}
          />
          <div>
            <Text strong className="text-base mb-1 block">
              {record.name}
            </Text>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <MailOutlined className="mr-1" />
              <Text type="secondary" className="text-xs">
                {record.email}
              </Text>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <PhoneOutlined className="mr-1" />
              <Text type="secondary" className="text-xs">
                {record.phone || "Chưa có"}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giới tính",
      key: "gender",
      width: 150,
      align: "center",
      render: (_, record) => (
        <div className="text-center text-xl">
          <div className="text-xs text-gray-500">
            {record.gender === "M"
              ? "Nam"
              : record.gender === "F"
                ? "Nữ"
                : "Không xác định"}
          </div>
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
        const customerId = record.userId || record.id;
        const isLoading = switchLoadingStates[customerId] || false;

        return (
          <div className="text-center">
            <Popconfirm
              title={
                isActive ? "Xác nhận ngừng hoạt động" : "Xác nhận kích hoạt"
              }
              description={
                isActive
                  ? "Khách hàng sẽ không thể đăng nhập. Bạn có chắc chắn?"
                  : "Khách hàng sẽ được phép đăng nhập lại. Bạn có chắc chắn?"
              }
              onConfirm={() => handleStatusChange(customerId, !isActive)}
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
              {getStatusText(status)}
            </div>
          </div>
        );
      },
    },
    // {
    //   title: "Thống kê",
    //   key: "stats",
    //   width: 120,
    //   align: "center",
    //   render: (_, record) => (
    //     <div className="text-center">
    //       <Text strong className="text-green-600 block">
    //         {record.orderCount || 0} đơn
    //       </Text>
    //       <Text className="text-xs text-gray-500">
    //         {(record.totalSpent || 0).toLocaleString()} VNĐ
    //       </Text>
    //     </div>
    //   ),
    // },
    {
      title: "Ngày tham gia",
      dataIndex: "joinDate",
      key: "joinDate",
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
              description="Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác."
              onConfirm={() => onDelete(record.userId || record.id)}
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
      dataSource={customers}
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} khách hàng`,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      onChange={onTableChange}
      rowKey={(record) => record.userId || record.id}
      scroll={{ x: 800 }}
      size="middle"
      className="custom-table"
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row-light" : "table-row-dark"
      }
    />
  );
};

export default CustomerTable;
