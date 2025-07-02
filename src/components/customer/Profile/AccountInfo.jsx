import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  DatePicker,
  Typography,
  message,
  Spin,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { updateUser } from "../../../services/users";
import useCustomer from "../../../hooks/useCustomer";

const { Title } = Typography;

const AccountInfo = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { updateCustomer } = useCustomer();

  useEffect(() => {
    const initializeForm = async () => {
      try {
        console.log("User prop received:", user);

        if (!user) {
          message.error("Không tìm thấy thông tin người dùng");
          return;
        }

        // Khởi tạo form với thông tin người dùng đã được truyền từ component cha
        form.setFieldsValue({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: user.gender || "M",
          address: user.address || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error initializing form:", error);
        message.error("Không thể tải thông tin người dùng");
        setLoading(false);
      }
    };

    initializeForm();
  }, [form, user]);

  const handleUpdate = async (values) => {
    try {
      setUpdating(true);

      if (!user) {
        message.error("Không tìm thấy thông tin người dùng");
        return;
      }

      const userId = user.id || user.userId || user._id;

      if (!userId) {
        message.error("Không tìm thấy ID người dùng");
        return;
      }

      // Chuẩn bị dữ liệu để cập nhật
      const formattedValues = { ...values };
      delete formattedValues.email;

      try {
        await updateCustomer(userId, formattedValues);

        // Cập nhật localStorage với thông tin mới
        const updatedUser = {
          ...user,
          name: values.name,
          phone: values.phone,
          gender: values.gender,
          address: values.address,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Tạo sự kiện tùy chỉnh để thông báo thông tin người dùng đã thay đổi
        const userUpdatedEvent = new CustomEvent("userUpdated", {
          detail: updatedUser,
        });
        window.dispatchEvent(userUpdatedEvent);

        message.success("Cập nhật thông tin thành công");
      } catch (hookError) {
        console.error(
          "Hook updateCustomer failed, trying direct API:",
          hookError
        );

        try {
          await updateUser(userId, formattedValues);

          // Cập nhật localStorage với thông tin mới
          const updatedUser = {
            ...user,
            name: values.name,
            phone: values.phone,
            gender: values.gender,
            address: values.address,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Tạo sự kiện tùy chỉnh để thông báo thông tin người dùng đã thay đổi
          const userUpdatedEvent = new CustomEvent("userUpdated", {
            detail: updatedUser,
          });
          window.dispatchEvent(userUpdatedEvent);

          message.success("Cập nhật thông tin thành công");
        } catch (apiError) {
          console.error("API error when updating user:", apiError);

          const updatedUser = {
            ...user,
            name: values.name,
            phone: values.phone,
            gender: values.gender,
            address: values.address,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Vẫn tạo sự kiện để cập nhật UI
          const userUpdatedEvent = new CustomEvent("userUpdated", {
            detail: updatedUser,
          });
          window.dispatchEvent(userUpdatedEvent);

          message.warning(
            "Không thể kết nối đến server, đã lưu thông tin cục bộ"
          );
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Cập nhật thông tin thất bại");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={4} className="mb-6">
        Thông tin tài khoản
      </Title>

      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên" },
              { max: 100, message: "Họ và tên không được vượt quá 100 ký tự" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập họ và tên"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              disabled
              className="rounded-lg bg-gray-50"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="Nhập số điện thoại"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập địa chỉ"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
            className="col-span-1 md:col-span-2"
          >
            <Radio.Group>
              <Radio value="M">Nam</Radio>
              <Radio value="F">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <Divider />

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={updating}
            className="bg-verdigris-500 hover:bg-verdigris-600 border-verdigris-500 hover:border-verdigris-600 rounded-lg h-10 px-8"
          >
            Cập nhật thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AccountInfo;
