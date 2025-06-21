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
  onActiveChange,
}) => {
  const [switchLoadingStates, setSwitchLoadingStates] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleActiveChange = async (productId, checked) => {
    try {
      // Set loading state for this specific switch
      setSwitchLoadingStates((prev) => ({
        ...prev,
        [productId]: true,
      }));

      console.log("Table active change:", { productId, checked }); // Debug log

      if (onActiveChange) {
        await onActiveChange(productId, checked);
      }
    } catch (error) {
      console.error("Error changing active:", error);
    } finally {
      // Clear loading state for this specific switch
      setSwitchLoadingStates((prev) => ({
        ...prev,
        [productId]: false,
      }));
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "productId",
      key: "productId",
      width: 80,
      render: (id, record) => (
        <Text code className="text-blue-600 text-lg">
          #{record.productId || record.id}
        </Text>
      ),
    },
    {
      title: "Mã SKU",
      dataIndex: "sku",
      key: "sku",
      width: 100,
      align: "center",
      render: (sku, record) => (
        <Text type="secondary">{sku || `WS-${record.productId || record.id}`}</Text>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      align: "center",
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
                setPreviewImage(
                  imageUrl || "/assets/images/products/default.jpg"
                );
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
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong className="text-base mb-1 block">
            {record.name}
          </Text>
          <Space size="small" wrap>
            <Tag color="blue">{record.brand?.name || record.brand}</Tag>
            <Tag color="green">{record.category?.name || record.category}</Tag>
          </Space>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "center",
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
      align: "center",
      render: (_, record) => (
        <div className="text-center">
          <div className="text-base font-medium">
            {record.remainQuantity || record.quantity || 0}
          </div>
          <Tag
            color={record.remainQuantity ? "success" : "error"}
            className="text-xs"
          >
            {record.remainQuantity ? "Còn hàng" : "Hết hàng"}
          </Tag>
        </div>
      ),
    },
    // {
    //   title: "Đánh giá",
    //   key: "rating",
    //   width: 120,
    //   render: (_, record) => (
    //     <div className="text-center">
    //       <Rate
    //         disabled
    //         allowHalf
    //         value={record.rating || 0}
    //         className="text-sm"
    //       />
    //       <div className="text-xs text-gray-500 mt-1">
    //         ({record.reviewCount || record.reviews || 0} đánh giá)
    //       </div>
    //     </div>
    //   ),
    // },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      width: 120,
      align: "center",
      render: (active, record) => {
        const isActive = active === true || record.isActive === true;
        const productId = record.productId || record.id;
        const isLoading = switchLoadingStates[productId] || false;

        return (
          <div className="text-center">
            <Popconfirm
              title={
                isActive ? "Xác nhận ngừng hoạt động" : "Xác nhận kích hoạt"
              }
              description={
                isActive
                  ? "Sản phẩm sẽ được chuyển sang trạng thái ngừng hoạt động. Bạn có chắc chắn?"
                  : "Sản phẩm sẽ được kích hoạt lại. Bạn có chắc chắn?"
              }
              onConfirm={() => handleActiveChange(productId, !isActive)}
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
      align: "center",
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
      {/* <Modal
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
      </Modal> */}
    </>
  );
};

export default ProductTable;
