import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  Select,
  Divider,
} from "antd";
import { TagOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const AttributeTypeForm = ({
  visible,
  attributeType,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!attributeType;

  useEffect(() => {
    if (visible) {
      if (isEdit && attributeType) {
        form.setFieldsValue({
          name: attributeType.name,
          status: attributeType.status || "active",
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "active",
        });
      }
    }
  }, [visible, isEdit, attributeType, form]);

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        const attributeTypeId = attributeType.attrTypeId || attributeType.id;
        await onSubmit(values, attributeTypeId);
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

  // Predefined attribute type suggestions
  const attributeTypeSuggestions = [
    "Kích thước mặt đồng hồ",
    "Chất liệu dây đeo",
    "Chất liệu vỏ",
    "Loại máy",
    "Độ chống nước",
    "Màu mặt số",
    "Màu vỏ",
    "Kiểu dáng",
    "Xuất xứ",
    "Bảo hành",
    "Tính năng đặc biệt",
    "Phong cách",
  ];

  return (
    <Modal
      title={
        <Space>
          <TagOutlined />
          {isEdit ? "Chỉnh sửa loại thuộc tính" : "Thêm loại thuộc tính mới"}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
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
          {/* Attribute Type Name */}
          <Col span={24}>
            <Form.Item
              label={
                <Space>
                  <TagOutlined />
                  <span>Tên loại thuộc tính</span>
                </Space>
              }
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên loại thuộc tính" },
                { min: 2, message: "Tên loại thuộc tính phải có ít nhất 2 ký tự" },
                { max: 100, message: "Tên loại thuộc tính không được quá 100 ký tự" },
              ]}
            >
              <Input 
                placeholder="Nhập tên loại thuộc tính" 
                size="large"
                list="attribute-suggestions"
              />
            </Form.Item>
            
            {/* Datalist for suggestions */}
            <datalist id="attribute-suggestions">
              {attributeTypeSuggestions.map((suggestion, index) => (
                <option key={index} value={suggestion} />
              ))}
            </datalist>
          </Col>

          {/* Status */}
          <Col span={24}>
            <Form.Item
              label={
                <Space>
                  <InfoCircleOutlined />
                  <span>Trạng thái</span>
                </Space>
              }
              name="status"
              rules={[
                { required: true, message: "Vui lòng chọn trạng thái" },
              ]}
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

          {/* Suggestions */}
          <Col span={24}>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <InfoCircleOutlined className="text-blue-500 mt-1" />
                <div>
                  <div className="font-medium text-blue-800 mb-2">
                    Gợi ý các loại thuộc tính phổ biến:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attributeTypeSuggestions.slice(0, 6).map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => form.setFieldsValue({ name: suggestion })}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Additional Info for Edit Mode */}
          {isEdit && (
            <Col span={24}>
              <Divider />
              <div className="bg-gray-50 p-4 rounded-lg">
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <div className="text-sm">
                      <span className="text-gray-500">ID loại thuộc tính:</span>
                      <span className="ml-2 font-medium">
                        {attributeType.attrTypeId || attributeType.id}
                      </span>
                    </div>
                  </Col>
                  {attributeType.createdAt && (
                    <Col span={12}>
                      <div className="text-sm">
                        <span className="text-gray-500">Ngày tạo:</span>
                        <span className="ml-2 font-medium">
                          {new Date(attributeType.createdAt).toLocaleDateString("vi-VN")}
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
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default AttributeTypeForm;