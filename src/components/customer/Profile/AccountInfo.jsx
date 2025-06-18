import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Radio, 
  DatePicker, 
  Divider, 
  Typography, 
  message, 
  Skeleton, 
  Row,
  Col,
  Card
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  CalendarOutlined
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

import { updateUserInfo } from "../../../store/slices/authSlice";
import { getUserById, updateUser } from "../../../services/users";

const { Title, Text } = Typography;

const AccountInfo = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const response = await getUserById(user.id);
        
        // Format date if available
        if (response.birthDate) {
          response.birthDate = moment(response.birthDate);
        }
        
        form.setFieldsValue({
          name: response.name,
          email: response.email,
          phone: response.phone,
          gender: response.gender || 'O',
          birthDate: response.birthDate ? moment(response.birthDate) : null
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        message.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [user, form]);
  
  const handleSubmit = async (values) => {
    if (!user?.id) {
      message.error("Không tìm thấy thông tin người dùng");
      return;
    }
    
    setSubmitLoading(true);
    try {
      // Format birthDate to ISO string if it exists
      const formattedValues = { ...values };
      if (values.birthDate) {
        formattedValues.birthDate = values.birthDate.format('YYYY-MM-DD');
      }
      
      // Remove email as it shouldn't be updated
      delete formattedValues.email;
      
      const response = await updateUser(user.id, formattedValues);
      
      // Update Redux store with new user info
      dispatch(updateUserInfo(response));
      
      message.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div>
        <Title level={4} className="mb-6">Thông tin tài khoản</Title>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }
  
  return (
    <div>
      <Title level={4} className="mb-6">Thông tin tài khoản</Title>
      
      <Card className="mb-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            gender: user?.gender || 'O',
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên' },
                  { max: 100, message: 'Họ và tên không được vượt quá 100 ký tự' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined className="text-gray-400" />} 
                  placeholder="Nhập họ và tên" 
                  className="rounded-lg" 
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
              >
                <Input 
                  prefix={<MailOutlined className="text-gray-400" />} 
                  placeholder="Email" 
                  disabled 
                  className="rounded-lg bg-gray-50" 
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { 
                    pattern: /^[0-9]{10,11}$/, 
                    message: 'Số điện thoại không hợp lệ' 
                  }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined className="text-gray-400" />} 
                  placeholder="Nhập số điện thoại" 
                  className="rounded-lg" 
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="birthDate"
                label="Ngày sinh"
              >
                <DatePicker 
                  placeholder="Chọn ngày sinh" 
                  className="w-full rounded-lg"
                  format="DD/MM/YYYY"
                  suffixIcon={<CalendarOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24}>
              <Form.Item
                name="gender"
                label="Giới tính"
              >
                <Radio.Group>
                  <Radio value="M">Nam</Radio>
                  <Radio value="F">Nữ</Radio>
                  <Radio value="O">Khác</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          
          <Divider />
          
          <Form.Item className="mb-0 text-right">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitLoading}
              className="bg-verdigris-500 hover:bg-verdigris-600 border-verdigris-500 hover:border-verdigris-600 rounded-lg h-10 px-8"
            >
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AccountInfo;