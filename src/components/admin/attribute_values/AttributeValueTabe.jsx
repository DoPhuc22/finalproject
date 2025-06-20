import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Popconfirm,
  Tooltip,
  Switch,
  Badge,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TagOutlined,
  ShoppingOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const AttributeValueTable = ({
  attributeValues = [],
  products = [],
  attributeTypes = [],
  loading = false,
  pagination = {},
  onEdit,
  onDelete,
  onTableChange,
  onStatusChange,
}) => {
  const [switchLoadingStates, setSwitchLoadingStates] = useState({});

  const handleStatusChange = async (id, checked) => {
    try {
      setSwitchLoadingStates((prev) => ({ ...prev, [id]: true }));

      // Find the attribute value to get its product_id
      const attrValue = attributeValues.find(
        (item) => item.attr_value_id === id || item.attrValueId === id
      );

      if (!attrValue) {
        throw new Error("Cannot find attribute value");
      }

      await onStatusChange(id, checked ? "active" : "inactive");
    } catch (error) {
      console.error("Error changing status:", error);
    } finally {
      setSwitchLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getProductName = (productId) => {
    if (!productId) return "Không xác định";

    const product = products.find(
      (p) =>
        p.id === productId ||
        p.productId === productId ||
        String(p.id) === String(productId) ||
        String(p.productId) === String(productId)
    );

    return product ? product.name : `Sản phẩm #${productId}`;
  };

  const getAttributeTypeName = (typeId) => {
    if (!typeId) return "Không xác định";

    const type = attributeTypes.find(
      (t) =>
        t.attr_type_id === typeId ||
        t.attrTypeId === typeId ||
        String(t.attr_type_id) === String(typeId) ||
        String(t.attrTypeId) === String(typeId)
    );

    return type ? type.name : `Loại thuộc tính #${typeId}`;
  };

  const columns = [
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      width: 200,
      sorter: true,
      render: (value) => (
        <div className="flex items-center">
          <TagOutlined className="mr-2 text-blue-500" />
          <Text strong>{value}</Text>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "product_id",
      key: "product_id",
      width: 250,
      sorter: true,
      render: (productId) => (
        <div className="flex items-center">
          <ShoppingOutlined className="mr-2 text-green-500" />
          <Text ellipsis={{ tooltip: getProductName(productId) }}>
            {getProductName(productId)}
          </Text>
        </div>
      ),
    },
    {
      title: "Loại thuộc tính",
      dataIndex: "attr_type_id",
      key: "attr_type_id",
      width: 200,
      sorter: true,
      render: (typeId) => (
        <div className="flex items-center">
          <InfoCircleOutlined className="mr-2 text-purple-500" />
          <Text>{getAttributeTypeName(typeId)}</Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      sorter: true,
      render: (status, record) => {
        const isActive = status === "active";
        return (
          <Space>
            <Switch
              checked={isActive}
              loading={switchLoadingStates[record.attr_value_id]}
              onChange={(checked) =>
                handleStatusChange(record.attr_value_id, checked)
              }
              size="small"
            />
            <Badge
              status={isActive ? "success" : "error"}
              text={isActive ? "Đang hoạt động" : "Tạm ngưng"}
            />
          </Space>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa giá trị thuộc tính này?"
              onConfirm={() => onDelete(record.attr_value_id)}
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
        dataSource={attributeValues}
        loading={loading}
        pagination={{
          ...pagination,
          className: "px-4 py-3 bg-slate-50",
        }}
        onChange={onTableChange}
        rowKey={(record) =>
          record.attr_value_id || record.attrValueId || record.id
        }
        scroll={{ x: 1000 }}
        className="custom-table"
        size="middle"
        rowClassName={(record) =>
          record.status === "inactive" ? "bg-slate-50 opacity-70" : ""
        }
        locale={{
          emptyText: (
            <Empty
              description="Không có dữ liệu"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />
    </div>
  );
};

export default AttributeValueTable;