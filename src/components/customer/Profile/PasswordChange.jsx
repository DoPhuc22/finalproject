import React, { useState } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Divider, 
  message, 
  Alert,
  Card
} from "antd";
import { 
  LockOutlined, 
  SafetyOutlined 
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { changePassword } from "../../../services/users";

const { Title, Text } = Typography;

const PasswordChange = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (values) => {
    if (!user?.id) {
      message.error("Không tìm thấy thông tin người dùng");
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    
    try {
      await changePassword(user.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      
      setSuccess(true);
      form.resetFields();
      message.success("Đổi mật khẩu thành công");
    } catch (error) {
      console.error("Error changing password:", error);
      
      if (error.message && error.message.includes("current password")) {
        message.error("Mật khẩu hiện tại không chính xác");
      } else {
        message.error("Đổi mật khẩu thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <Title level={4} className="mb-6">Đổi mật khẩu</Title>
      
      {success && (
        <Alert
          message="Đổi mật khẩu thành công"
          description="Mật khẩu của bạn đã được cập nhật. Vui lòng sử dụng mật khẩu mới trong lần đăng nhập tiếp theo."
          type="success"
          showIcon
          className="mb-6"
          closable
        />
      )}
      
      <Card className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <Text className="text-blue-800 flex items-center">
            <SafetyOutlined className="mr-2" />
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu với người khác
          </Text>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="Nhập mật khẩu hiện tại" 
              className="rounded-lg" 
            />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
            hasFeedback
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="Nhập mật khẩu mới" 
              className="rounded-lg" 
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                },
              })
            ]}
            hasFeedback
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="Xác nhận mật khẩu mới" 
              className="rounded-lg" 
            />
          </Form.Item>
          
          <Divider />
          
          <Form.Item className="mb-0 text-right">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="bg-verdigris-500 hover:bg-verdigris-600 border-verdigris-500 hover:border-verdigris-600 rounded-lg h-10 px-8"
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PasswordChange;