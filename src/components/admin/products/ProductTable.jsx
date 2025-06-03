import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Image,
  Typography,
  Popconfirm,
  Tooltip,
  Rate,
  Switch,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShoppingOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const ProductTable = ({
  products = [],
  loading = false,
  pagination = {},
  onEdit,
  onDelete,
  onView,
  onTableChange,
  onStatusChange,
}) => {
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleStatusChange = async (productId, checked) => {
    try {
      await onStatusChange(productId, checked);
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (imageUrl, record) => (
        <Image
          width={60}
          height={60}
          src={imageUrl || "/assets/images/products/default.jpg"}
          alt={record.name}
          style={{ objectFit: "cover", borderRadius: 6 }}
          placeholder={true}
          preview={{
            onVisibleChange: (visible) => {
              if (visible) {
                setPreviewImage(imageUrl);
                setPreviewVisible(true);
              }
            },
          }}
        />
      ),
    },
    {
      title: "Thông tin sản phẩm",
      key: "info",
      width: 300,
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
            {record.description}
          </Paragraph>
          <Space size="small" wrap>
            <Tag color="blue">{record.brand?.name || record.brand}</Tag>
            <Tag color="green">{record.category?.name || record.category}</Tag>
            <Text type="secondary" className="text-xs">
              SKU: {record.sku || `WS-${record.productId || record.id}`}
            </Text>
          </Space>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      sorter: true,
      render: (price, record) => (
        <div className="text-center">
          <Text strong className="text-lg text-green-600">
            {price?.toLocaleString("vi-VN")} ₫
          </Text>
          {record.comparePrice && record.comparePrice > price && (
            <div>
              <Text delete type="secondary" className="text-sm">
                {record.comparePrice.toLocaleString("vi-VN")} ₫
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Kho",
      key: "inventory",
      width: 100,
      render: (_, record) => (
        <div className="text-center">
          <div className="text-base font-medium">
            {record.stockQuantity || record.quantity || 0}
          </div>
          <Tag color={record.inStock ? "success" : "error"} className="text-xs">
            {record.inStock ? "Còn hàng" : "Hết hàng"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      key: "rating",
      width: 120,
      render: (_, record) => (
        <div className="text-center">
          <Rate
            disabled
            allowHalf
            value={record.rating || 0}
            className="text-sm"
          />
          <div className="text-xs text-gray-500 mt-1">
            ({record.reviewCount || record.reviews || 0} đánh giá)
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status, record) => (
        <div className="text-center">
          <Switch
            checked={status === "active" || record.isActive}
            onChange={(checked) =>
              handleStatusChange(record.productId || record.id, checked)
            }
            checkedChildren="Bán"
            unCheckedChildren="Dừng"
            size="small"
          />
          <div className="text-xs text-gray-500 mt-1">
            {status === "active" || record.isActive ? "Đang bán" : "Ngừng bán"}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      sorter: true,
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
              description="Bạn có chắc chắn muốn xóa sản phẩm này?"
              onConfirm={() => onDelete(record.productId || record.id)}
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
    <>
      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} sản phẩm`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={onTableChange}
        rowKey={(record) => record.productId || record.id}
        scroll={{ x: 1200 }}
        size="middle"
        className="custom-table"
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
      />

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title="Xem ảnh sản phẩm"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={600}
        centered
      >
        <Image
          src={previewImage}
          alt="Product preview"
          style={{ width: "100%" }}
        />
      </Modal>
    </>
  );
};

export default ProductTable;
