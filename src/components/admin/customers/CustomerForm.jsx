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
  Radio,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  CrownOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const CustomerForm = ({
  visible,
  onCancel,
  onSubmit,
  customer = null,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!customer;

  useEffect(() => {
    if (visible) {
      if (isEdit && customer) {
        form.setFieldsValue({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          role: customer.role || "customer",
          gender: customer.gender,
          address: customer.address || "",
          status: customer.status || "active",
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          role: "customer",
          status: "active",
        });
      }
    }
  }, [visible, isEdit, customer, form]);

  const handleSubmit = async (values) => {
    try {
      // Remove password if it's empty in edit mode
      const submitData = { ...values };
      if (isEdit && (!values.password || values.password.trim() === "")) {
        delete submitData.password;
      }

      if (isEdit) {
        // Truyền customerId và values riêng biệt
        const customerId = customer.userId || customer.id;
        await onSubmit(submitData, customerId);
      } else {
        await onSubmit(submitData);
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
          <UserOutlined />
          {isEdit ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
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
          {/* Customer Name */}
          <Col span={12}>
            <Form.Item
              label={
                <Space>
                  <UserOutlined />
                  <span>Họ và tên</span>
                </Space>
              }
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập họ và tên" },
                { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự" },
                { max: 100, message: "Họ và tên không được quá 100 ký tự" },
              ]}
            >
              <Input placeholder="Nhập họ và tên" size="large" />
            </Form.Item>
          </Col>
          {/* Email */}
          <Col span={12}>
            <Form.Item
              label={
                <Space>
                  <MailOutlined />
                  <span>Email</span>
                </Space>
              }
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email" size="large" />
            </Form.Item>
          </Col>
          {/* Phone */}
          <Col span={12}>
            <Form.Item
              label={
                <Space>
                  <PhoneOutlined />
                  <span>Số điện thoại</span>
                </Space>
              }
              name="phone"
              rules={[
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" size="large" />
            </Form.Item>
          </Col>
          {/* Address */}
          <Col span={12}>
            <Form.Item
              label={
                <Space>
                  <MailOutlined />
                  <span>Địa chỉ</span>
                </Space>
              }
              name="address"
              rules={[{ type: "address", message: "Địa chỉ không hợp lệ" }]}
            >
              <Input.TextArea placeholder="Nhập địa chỉ" size="large" />
            </Form.Item>
          </Col>
          {/* Password */}
          {!isEdit && (
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <LockOutlined />
                    <span>Mật khẩu</span>
                  </Space>
                }
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" size="large" />
              </Form.Item>
            </Col>
          )}
          {/* Gender */}
          <Col span={12}>
            <Form.Item
              label={
                <Space>
                  <UserOutlined />
                  <span>Giới tính</span>
                </Space>
              }
              name="gender"
            >
              <Radio.Group size="large">
                <Radio value="M">Nam</Radio>
                <Radio value="F">Nữ</Radio>
              </Radio.Group>
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
              <Radio.Group size="large">
                <Radio value="active">
                  <Space>
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    Hoạt động
                  </Space>
                </Radio>
                <Radio value="inactive">
                  <Space>
                    <span className="w-2 h-2 bg-gray-500 rounded-full inline-block"></span>
                    Ngừng hoạt động
                  </Space>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {/* Additional Info */}
          {isEdit && (
            <Col span={24}>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Row gutter={[16, 8]}>
                  <Col span={8}>
                    <div className="text-sm">
                      <span className="text-gray-500">ID khách hàng:</span>
                      <span className="ml-2 font-medium">
                        {customer.userId || customer.id}
                      </span>
                    </div>
                  </Col>
                  {customer.joinDate && (
                    <Col span={8}>
                      <div className="text-sm">
                        <span className="text-gray-500">Ngày tham gia:</span>
                        <span className="ml-2 font-medium">
                          {new Date(customer.joinDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </Col>
                  )}
                  {/* <Col span={8}>
                    <div className="text-sm">
                      <span className="text-gray-500">Tổng đơn hàng:</span>
                      <span className="ml-2 font-medium text-green-600">
                        {customer.orderCount || 0} đơn
                      </span>
                    </div>
                  </Col> */}
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

export default CustomerForm;
