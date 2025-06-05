import React, { useEffect } from "react";
import { Modal, Form, Input, Row, Col, Space, Button } from "antd";
import {
  AppstoreOutlined,
  TagOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const CategoryForm = ({
  visible,
  onCancel,
  onSubmit,
  category = null,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!category;

  useEffect(() => {
    if (visible) {
      if (isEdit && category) {
        form.setFieldsValue({
          name: category.name,
          description: category.description,
          color: category.color || "#1890ff",
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          color: "#1890ff",
        });
      }
    }
  }, [visible, isEdit, category, form]);

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        // Truyền categoryId và values riêng biệt
        const categoryId = category.categoryId || category.id;
        await onSubmit(values, categoryId);
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
          <AppstoreOutlined />
          {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
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
          {/* Category Name */}
          <Col span={24}>
            <Form.Item
              label={
                <Space>
                  <TagOutlined />
                  <span>Tên danh mục</span>
                </Space>
              }
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục" },
                { min: 2, message: "Tên danh mục phải có ít nhất 2 ký tự" },
                { max: 100, message: "Tên danh mục không được quá 100 ký tự" },
              ]}
            >
              <Input placeholder="Nhập tên danh mục" size="large" />
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
                placeholder="Mô tả chi tiết về danh mục"
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Col>

          {/* Additional Info */}
          {isEdit && (
            <Col span={24}>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <div className="text-sm">
                      <span className="text-gray-500">ID danh mục:</span>
                      <span className="ml-2 font-medium">
                        {category.categoryId || category.id}
                      </span>
                    </div>
                  </Col>
                  {category.createdAt && (
                    <Col span={12}>
                      <div className="text-sm">
                        <span className="text-gray-500">Ngày tạo:</span>
                        <span className="ml-2 font-medium">
                          {new Date(category.createdAt).toLocaleDateString(
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

export default CategoryForm;
