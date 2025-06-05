import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Divider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../services/auth";
import { loginSuccess } from "../../../store/slices/authSlice";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Thêm form instance
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Gọi API đăng nhập
      const response = await login({
        email: values.email,
        password: values.password,
      });

      // Kiểm tra response có dữ liệu cần thiết không
      // if (!response || !response.user || !response.token) {
      //   throw new Error("Dữ liệu phản hồi từ server không hợp lệ");
      // }

      // Dispatch action để update Redux store
      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
        })
      );

      message.success("Đăng nhập thành công!");

      // Chuyển hướng dựa vào role của user (với kiểm tra an toàn)
      const userRole = response.user?.role;
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/"); // Về homepage
      }
    } catch (error) {
      console.error("Login error:", error);

      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Đăng nhập thất bại, vui lòng thử lại!";

      // Kiểm tra chi tiết lỗi từ response
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      // Hiển thị lỗi cụ thể cho người dùng
      if (
        errorMessage.includes("email") ||
        errorMessage.includes("password") ||
        errorMessage.includes("Invalid") ||
        errorMessage.includes("incorrect")
      ) {
        errorMessage = "Email hoặc mật khẩu không chính xác!";
      } else if (
        errorMessage.includes("401") ||
        errorMessage.includes("Unauthorized")
      ) {
        errorMessage = "Thông tin đăng nhập không chính xác!";
      } else if (errorMessage.includes("404")) {
        errorMessage = "Tài khoản không tồn tại!";
      } else if (errorMessage.includes("500")) {
        errorMessage = "Lỗi hệ thống, vui lòng thử lại sau!";
      }

      // Hiển thị thông báo lỗi
      message.error(errorMessage);

      // Giữ lại email, xóa password
      const currentEmail = form.getFieldValue("email");
      form.setFieldsValue({
        email: currentEmail, // Giữ lại email
        password: "", // Xóa password
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form} // Thêm form instance
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
      className="login-form"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
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

      <Form.Item>
        <div className="flex justify-between items-center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Link
            to="/forgot-password"
            className="text-verdigris-500 hover:text-verdigris-600 hover:no-underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
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
          Đăng Nhập
        </Button>
      </Form.Item>

      <Divider plain>Hoặc đăng nhập với</Divider>

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

export default LoginForm;
