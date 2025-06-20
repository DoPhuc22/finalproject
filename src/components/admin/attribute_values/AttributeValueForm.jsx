import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  Divider,
  Typography,
  Row,
  Col,
} from "antd";
import {
  TagOutlined,
  InfoCircleOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

const AttributeValueForm = ({
  visible,
  onCancel,
  onSubmit,
  attributeValue = null,
  products = [],
  attributeTypes = [],
  loading = false,
}) => {
  const [form] = Form.useForm();

  const isEdit = !!attributeValue;

  useEffect(() => {
    if (visible) {
      if (isEdit && attributeValue) {
        // Populate form with attribute value data
        form.setFieldsValue({
          product_id: attributeValue.product_id,
          attr_type_id: attributeValue.attr_type_id,
          value: attributeValue.value,
          status: attributeValue.status || "active",
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "active",
        });
      }
    }
  }, [visible, isEdit, attributeValue, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);

      if (isEdit) {
        await onSubmit(values, attributeValue.attr_value_id);
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
          <TagOutlined />
          {isEdit ? "Chỉnh sửa giá trị thuộc tính" : "Thêm giá trị thuộc tính mới"}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
      className="attribute-value-form-modal"
    >
      <Form
        form={form}
        layout="vertical"
        scrollToFirstError
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="product_id"
              label="Sản phẩm"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
            >
              <Select
                placeholder="Chọn sản phẩm"
                loading={loading}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {products.map((product) => (
                  <Option
                    key={product.id || product.productId}
                    value={product.id || product.productId}
                  >
                    {product.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="attr_type_id"
              label="Loại thuộc tính"
              rules={[{ required: true, message: "Vui lòng chọn loại thuộc tính" }]}
            >
              <Select placeholder="Chọn loại thuộc tính">
                {attributeTypes.map((type) => (
                  <Option key={type.attr_type_id} value={type.attr_type_id}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="value"
              label="Giá trị thuộc tính"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị thuộc tính" },
                { min: 1, message: "Giá trị thuộc tính không được để trống" },
              ]}
            >
              <Input placeholder="Nhập giá trị thuộc tính" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="status"
              label="Trạng thái"
              initialValue="active"
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Additional Info for Edit Mode */}
        {isEdit && (
          <>
            <Divider />
            <div className="mb-4">
              <Space direction="vertical" size="small">
                <Text type="secondary">
                  <InfoCircleOutlined className="mr-1" />
                  ID: <Text code>{attributeValue.attr_value_id}</Text>
                </Text>
                {attributeValue.created_at && (
                  <Text type="secondary">
                    <InfoCircleOutlined className="mr-1" />
                    Ngày tạo: {new Date(attributeValue.created_at).toLocaleString()}
                  </Text>
                )}
                {attributeValue.updated_at && (
                  <Text type="secondary">
                    <InfoCircleOutlined className="mr-1" />
                    Cập nhật lần cuối: {new Date(attributeValue.updated_at).toLocaleString()}
                  </Text>
                )}
              </Space>
            </div>
          </>
        )}

        <div className="flex justify-end mt-4">
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
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

export default AttributeValueForm;