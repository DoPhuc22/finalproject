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
import { getUserById, updateUser } from "../../../services/users";

const { Title } = Typography;

const AccountInfo = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("User prop received:", user);

        if (!user) {
          message.error("Không tìm thấy thông tin người dùng");
          return;
        }

        // Đảm bảo có user.id
        const userId = user.id || user.userId || user._id;

        if (!userId) {
          console.error("User object without ID:", user);
          message.error("Không tìm thấy ID người dùng");
          return;
        }

        try {
          // Thử lấy thông tin chi tiết từ API
          console.log("Fetching user data for ID:", userId);
          const response = await getUserById(userId);
          console.log("API response:", response);
          setUserData(response);

          form.setFieldsValue({
            name: response.name,
            email: response.email,
            phone: response.phone || "",
            gender: response.gender || "M",
          });
        } catch (apiError) {
          console.error("Error fetching user data from API:", apiError);

          // Fallback: sử dụng dữ liệu từ localStorage nếu API lỗi
          form.setFieldsValue({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            gender: user.gender || "M",
          });

          message.warning(
            "Không thể kết nối đến server, đang hiển thị thông tin đã lưu"
          );
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        message.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [form, user]);

  const handleUpdate = async (values) => {
    try {
      setUpdating(true);

      if (!user) {
        message.error("Không tìm thấy thông tin người dùng");
        return;
      }

      // Đảm bảo có user.id
      const userId = user.id || user.userId || user._id;

      if (!userId) {
        message.error("Không tìm thấy ID người dùng");
        return;
      }
      const formattedValues = { ...values };
      // Remove email as it shouldn't be updated
      delete formattedValues.email;

      try {
        await updateUser(userId, formattedValues);

        // Update localStorage with new info
        const updatedUser = {
          ...user,
          name: values.name,
          phone: values.phone,
          gender: values.gender,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        message.success("Cập nhật thông tin thành công");
      } catch (apiError) {
        console.error("API error when updating user:", apiError);

        // Fallback: Chỉ cập nhật localStorage nếu API lỗi
        const updatedUser = {
          ...user,
          name: values.name,
          phone: values.phone,
          gender: values.gender,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        message.warning(
          "Không thể kết nối đến server, đã lưu thông tin cục bộ"
        );
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

      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
        initialValues={{
          gender: "M",
        }}
      >
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
