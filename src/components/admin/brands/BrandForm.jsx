import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Space,
  Button,
  Select,
  Switch,
} from "antd";
import {
  TrademarkOutlined,
  TagOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const BrandForm = ({
  visible,
  onCancel,
  onSubmit,
  brand = null,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!brand;

  useEffect(() => {
    if (visible) {
      if (isEdit && brand) {
        form.setFieldsValue({
          name: brand.name,
          description: brand.description,
          status: brand.status || "active",
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "active",
        });
      }
    }
  }, [visible, isEdit, brand, form]);

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        // Truyền brandId và values riêng biệt
        const brandId = brand.brandId || brand.id;
        await onSubmit(values, brandId);
      } else {
        await onSubmit(values);
      }

      handleCancel();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <TrademarkOutlined />
          {isEdit ? "Chỉnh sửa nhãn hàng" : "Thêm nhãn hàng mới"}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
      className="rounded-xl overflow-hidden"
      styles={{
        header: {
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        },
        body: {
          background: "#fff",
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        scrollToFirstError
      >
        <Row gutter={[16, 16]}>
          {/* Brand Name */}
          <Col span={24}>
            <Form.Item
              label={
                <Space>
                  <TagOutlined />
                  <span>Tên nhãn hàng</span>
                </Space>
              }
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên nhãn hàng" },
                { min: 2, message: "Tên nhãn hàng phải có ít nhất 2 ký tự" },
                { max: 100, message: "Tên nhãn hàng không được quá 100 ký tự" },
              ]}
            >
              <Input placeholder="Nhập tên nhãn hàng" size="large" />
            </Form.Item>
          </Col>

          {/* Description */}
          <Col span={24}>
            <Form.Item
              label={
                <Space>
                  <FileTextOutlined />
                  <span>Mô tả</span>
                </Space>
              }
              name="description"
              rules={[{ max: 500, message: "Mô tả không được quá 500 ký tự" }]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết về nhãn hàng"
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Col>

          {/* Status */}
          <Col span={24}>
            <Form.Item
              label={
                <Space>
                  <CheckCircleOutlined />
                  <span>Trạng thái</span>
                </Space>
              }
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái" size="large">
                <Option value="active">
                  <Space>
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    Hoạt động
                  </Space>
                </Option>
                <Option value="inactive">
                  <Space>
                    <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                    Ngừng hoạt động
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Additional Info */}
          {isEdit && (
            <Col span={24}>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <div className="text-sm">
                      <span className="text-gray-500">ID nhãn hàng:</span>
                      <span className="ml-2 font-medium">
                        {brand.brandId || brand.id}
                      </span>
                    </div>
                  </Col>
                  {brand.createdAt && (
                    <Col span={12}>
                      <div className="text-sm">
                        <span className="text-gray-500">Ngày tạo:</span>
                        <span className="ml-2 font-medium">
                          {new Date(brand.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </Col>
          )}
        </Row>

        <div className="text-right mt-6 pt-4 border-t border-gray-200">
          <Space>
            <Button onClick={handleCancel} size="large">
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default BrandForm;
