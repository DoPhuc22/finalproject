import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Divider, message, Radio } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
  FacebookOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../../services/auth";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Loại bỏ confirmPassword và agreement khỏi dữ liệu gửi lên API
      const { confirmPassword, agreement, ...userData } = values;

      // Gọi API đăng ký (không lưu token vào localStorage trong service)
      const response = await register(userData);

      message.success("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");

      // Chỉ chuyển hướng về trang đăng nhập, không tự động đăng nhập
      navigate("/auth");
    } catch (error) {
      console.error("Register error:", error);
      let errorMessage = "Đăng ký thất bại, vui lòng thử lại!";

      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      // Hiển thị lỗi cụ thể cho người dùng
      if (errorMessage.includes("email")) {
        errorMessage = "Email đã được sử dụng!";
      } else if (errorMessage.includes("phone")) {
        errorMessage = "Số điện thoại đã được sử dụng!";
      } else if (
        errorMessage.includes("400") ||
        errorMessage.includes("Bad Request")
      ) {
        errorMessage = "Thông tin đăng ký không hợp lệ!";
      } else if (
        errorMessage.includes("409") ||
        errorMessage.includes("Conflict")
      ) {
        errorMessage = "Tài khoản đã tồn tại!";
      } else if (errorMessage.includes("500")) {
        errorMessage = "Lỗi hệ thống, vui lòng thử lại sau!";
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="register"
      initialValues={{ agreement: true, role: "customer" }}
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
      className="register-form"
    >
      <Form.Item
        name="name"
        rules={[
          { required: true, message: "Vui lòng nhập tên của bạn!" },
          { min: 2, message: "Tên phải có ít nhất 2 ký tự!" },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Họ và tên"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="phone"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại!" },
          {
            pattern: /^[0-9]{9,11}$/,
            message: "Số điện thoại phải có 9-11 chữ số!",
          },
        ]}
      >
        <Input
          addonBefore="+84"
          prefix={<PhoneOutlined className="site-form-item-icon" />}
          placeholder="Số điện thoại"
          size="large"
          maxLength={11}
        />
      </Form.Item>

      <Form.Item
        name="address"
        rules={[
          { required: true, message: "Vui lòng nhập địa chỉ!" },
          { type: "address", message: "Address không hợp lệ!" },
        ]}
      >
        <Input
          prefix={<EnvironmentOutlined className="site-form-item-icon" />}
          placeholder="Địa chỉ"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" },
          { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Mật khẩu"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Vui lòng xác nhận mật khẩu!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Xác nhận mật khẩu"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="gender"
        rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
      >
        <Radio.Group>
          <Radio value="M">Nam</Radio>
          <Radio value="F">Nữ</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Hidden field cho role */}
      <Form.Item name="role" style={{ display: 'none' }} initialValue={'customer'}>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(
                    new Error("Bạn phải đồng ý với điều khoản sử dụng")
                  ),
          },
        ]}
      >
        <Checkbox>
          Tôi đã đọc và đồng ý với{" "}
          <Link
            to="/terms"
            className="text-verdigris-500 hover:text-verdigris-600 hover:no-underline"
          >
            điều khoản sử dụng
          </Link>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          className="bg-verdigris-500 hover:bg-verdigris-600"
        >
          Đăng Ký
        </Button>
      </Form.Item>

      <Divider plain>Hoặc đăng ký với</Divider>

      <div className="flex justify-center space-x-4 mb-4">
        <Button
          shape="circle"
          icon={<GoogleOutlined />}
          size="large"
          className="flex items-center justify-center border-gray-300"
        />
        <Button
          shape="circle"
          icon={<FacebookOutlined />}
          size="large"
          className="flex items-center justify-center border-gray-300"
        />
      </div>
    </Form>
  );
};

export default RegisterForm;
