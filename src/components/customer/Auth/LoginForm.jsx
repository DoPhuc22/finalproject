import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Divider, message, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../services/auth";
import { loginSuccess } from "../../../store/slices/authSlice";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values) => {
    try {
      // Xóa thông báo lỗi cũ khi thử đăng nhập lại
      setErrorMessage("");
      setLoading(true);

      // Gọi API đăng nhập
      const response = await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      // Kiểm tra response có dữ liệu cần thiết không
      if (!response || !response.token) {
        throw new Error("Dữ liệu phản hồi từ server không hợp lệ");
      }

      // Xác định thông tin user từ response
      let userData = {};

      if (response.user) {
        userData = { ...response.user };
      } else if (response.data && response.data.user) {
        userData = { ...response.data.user };
      } else {
        // Trường hợp response chứa thông tin user trực tiếp
        userData = { ...response };
        delete userData.token; // Không lưu token vào đối tượng user
      }

      // Đảm bảo user có trường id và email
      if (!userData.id) {
        if (userData.userId) userData.id = userData.userId;
        else if (userData._id) userData.id = userData._id;
        else if (response.userId) userData.id = response.userId;
        else if (response._id) userData.id = response._id;
        else userData.id = Date.now().toString(); // Tạo ID tạm thời nếu không có
      }

      if (!userData.email && values.email) {
        userData.email = values.email;
      }

      // Kiểm tra trạng thái tài khoản
      if (userData.status === "inactive" || userData.status === "blocked") {
        throw new Error("ACCOUNT_INACTIVE");
      }

      console.log("User data to save:", userData);

      // Dispatch action để update Redux store
      dispatch(
        loginSuccess({
          user: userData,
          token: response.token,
        })
      );

      message.success("Đăng nhập thành công!");

      // Chuyển hướng dựa vào role của user (với kiểm tra an toàn)
      const userRole = userData?.role;

      // Chuyển hướng về trang trước đó nếu có
      const { from } = location.state || { from: { pathname: "/" } };

      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(from.pathname || "/");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Xử lý các loại lỗi khác nhau
      let errorMsg =
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.";

      // Phân tích lỗi để hiển thị thông báo phù hợp
      const errorData = error?.response?.data;
      const errorStatus = error?.response?.status;
      const errorString = error?.message || "";

      // Kiểm tra mã lỗi HTTP
      if (errorStatus === 401) {
        errorMsg = "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.";
      } else if (errorStatus === 403) {
        errorMsg =
          "Tài khoản không có quyền truy cập. Vui lòng liên hệ quản trị viên.";
      } else if (errorStatus === 404) {
        errorMsg = "Tài khoản không tồn tại. Vui lòng kiểm tra lại email.";
      } else if (errorStatus === 429) {
        errorMsg = "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau.";
      } else if (errorStatus >= 500) {
        errorMsg = "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
      }

      // Kiểm tra nội dung lỗi
      if (
        errorString === "ACCOUNT_INACTIVE" ||
        errorString.includes("inactive") ||
        errorString.includes("blocked") ||
        (errorData &&
          (errorData.includes("inactive") || errorData.includes("blocked")))
      ) {
        errorMsg =
          "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.";
      } else if (
        errorString.includes("password") ||
        (errorData && errorData.includes("password"))
      ) {
        errorMsg = "Mật khẩu không chính xác. Vui lòng thử lại.";
      } else if (
        errorString.includes("email") ||
        (errorData && errorData.includes("email"))
      ) {
        errorMsg = "Email không chính xác hoặc không tồn tại.";
      } else if (
        errorString.includes("network") ||
        errorString.includes("timeout") ||
        errorString.includes("Network Error")
      ) {
        errorMsg =
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
      }

      // Hiển thị thông báo lỗi
      setErrorMessage(errorMsg);

      // Giữ lại email, xóa password
      const currentEmail = form.getFieldValue("email");
      form.setFieldsValue({
        email: currentEmail,
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
      className="login-form"
    >
      {errorMessage && (
        <Form.Item>
          <Alert
            message="Lỗi đăng nhập"
            description={errorMessage}
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            closable
            onClose={() => setErrorMessage("")}
            className="mb-4"
          />
        </Form.Item>
      )}

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
