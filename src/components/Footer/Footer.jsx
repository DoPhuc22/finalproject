import React from 'react';
import { Layout, Typography, Row, Col, Space, Divider, Button, Input, Form } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, LinkedinOutlined, SendOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

const Footer = () => {
  return (
    <AntFooter className="bg-verdigris-500 text-white p-0">
      {/* Newsletter Section */}
      <div className="bg-verdigris-600 py-10">
        <div className="container mx-auto px-4">
          <Row gutter={[24, 24]} align="middle" justify="space-between">
            <Col xs={24} lg={14}>
              <Title level={3} className="text-white m-0">Đăng ký nhận tin</Title>
              <Paragraph className="text-white/80 mb-0">
                Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và tin tức từ Watch Store
              </Paragraph>
            </Col>
            <Col xs={24} lg={10}>
              <Form layout="inline" className="flex flex-wrap">
                <Form.Item className="flex-grow mb-0">
                  <Input 
                    placeholder="Email của bạn" 
                    className="w-full py-2"
                    size="large"
                  />
                </Form.Item>
                <Form.Item className="mb-0">
                  <Button 
                    type="default" 
                    icon={<SendOutlined />} 
                    size="large"
                    className="bg-white text-verdigris-600 hover:bg-gray-100 hover:text-verdigris-500 border-white"
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <Row gutter={[48, 32]}>
            {/* Column 1: Logo & About */}
            <Col xs={24} sm={12} lg={8}>
              <div className="flex items-center mb-4">
                <img 
                  src="/assets/images/logo.png" 
                  alt="Watch Store" 
                  className="h-12 mr-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/48x48/3AA1A0/FFFFFF?text=WS";
                  }}
                />
                <Title level={3} className="text-white m-0">Watch Store</Title>
              </div>
              <Paragraph className="text-white/80 mb-6">
                Cửa hàng cung cấp các mẫu đồng hồ chính hãng với giá cả cạnh tranh và dịch vụ hậu mãi tốt nhất. Chúng tôi tự hào mang đến cho khách hàng những sản phẩm chất lượng cao từ các thương hiệu nổi tiếng thế giới.
              </Paragraph>
              <Space size="large">
                <Button 
                  type="text" 
                  shape="circle" 
                  icon={<FacebookOutlined className="text-xl" />} 
                  className="bg-white/10 text-white hover:bg-white hover:text-verdigris-600"
                  href="https://facebook.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  shape="circle" 
                  icon={<InstagramOutlined className="text-xl" />} 
                  className="bg-white/10 text-white hover:bg-white hover:text-verdigris-600"
                  href="https://instagram.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  shape="circle" 
                  icon={<TwitterOutlined className="text-xl" />} 
                  className="bg-white/10 text-white hover:bg-white hover:text-verdigris-600"
                  href="https://twitter.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  shape="circle" 
                  icon={<LinkedinOutlined className="text-xl" />} 
                  className="bg-white/10 text-white hover:bg-white hover:text-verdigris-600"
                  href="https://linkedin.com"
                  target="_blank"
                />
              </Space>
            </Col>
            
            {/* Column 2: Links */}
            <Col xs={24} sm={12} md={6} lg={5}>
              <Title level={4} className="text-white">Danh mục</Title>
              <ul className="list-none p-0">
                <li className="mb-2">
                  <Link to="/products?category=mechanical" className="text-white/80 hover:text-white hover:no-underline">Đồng hồ cơ</Link>
                </li>
                <li className="mb-2">
                  <Link to="/products?category=sport" className="text-white/80 hover:text-white hover:no-underline">Đồng hồ thể thao</Link>
                </li>
                <li className="mb-2">
                  <Link to="/products?category=smart" className="text-white/80 hover:text-white hover:no-underline">Đồng hồ thông minh</Link>
                </li>
                <li className="mb-2">
                  <Link to="/products?category=classic" className="text-white/80 hover:text-white hover:no-underline">Đồng hồ cổ điển</Link>
                </li>
                <li className="mb-2">
                  <Link to="/products?sale=true" className="text-white/80 hover:text-white hover:no-underline">Khuyến mãi</Link>
                </li>
              </ul>
            </Col>

            {/* Column 3: Support Links */}
            <Col xs={24} sm={12} md={6} lg={5}>
              <Title level={4} className="text-white">Hỗ trợ</Title>
              <ul className="list-none p-0">
                <li className="mb-2">
                  <Link to="/about" className="text-white/80 hover:text-white hover:no-underline">Về chúng tôi</Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="text-white/80 hover:text-white hover:no-underline">Liên hệ</Link>
                </li>
                <li className="mb-2">
                  <Link to="/faq" className="text-white/80 hover:text-white hover:no-underline">Câu hỏi thường gặp</Link>
                </li>
                <li className="mb-2">
                  <Link to="/shipping" className="text-white/80 hover:text-white hover:no-underline">Chính sách vận chuyển</Link>
                </li>
                <li className="mb-2">
                  <Link to="/returns" className="text-white/80 hover:text-white hover:no-underline">Chính sách đổi trả</Link>
                </li>
              </ul>
            </Col>

            {/* Column 4: Contact Info */}
            <Col xs={24} sm={12} md={6} lg={6}>
              <Title level={4} className="text-white">Liên hệ</Title>
              <ul className="list-none p-0">
                <li className="mb-3 flex items-start">
                  <EnvironmentOutlined className="mt-1 mr-2 text-white/80" />
                  <span className="text-white/80">123 Đường Thời Gian, Quận 1, TP. Hồ Chí Minh</span>
                </li>
                <li className="mb-3 flex items-center">
                  <PhoneOutlined className="mr-2 text-white/80" />
                  <a href="tel:+84123456789" className="text-white/80 hover:text-white hover:no-underline">+84 123 456 789</a>
                </li>
                <li className="mb-3 flex items-center">
                  <MailOutlined className="mr-2 text-white/80" />
                  <a href="mailto:info@watchstore.com" className="text-white/80 hover:text-white hover:no-underline">info@watchstore.com</a>
                </li>
                <li className="mb-3 flex items-start">
                  <ClockCircleOutlined className="mt-1 mr-2 text-white/80" />
                  <div>
                    <p className="text-white/80 m-0">Thứ 2 - Thứ 6: 8:00 - 20:00</p>
                    <p className="text-white/80 m-0">Thứ 7 & CN: 9:00 - 18:00</p>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-verdigris-600 py-5">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
          <Text className="text-white/80 text-sm">
            © {new Date().getFullYear()} Watch Store. Tất cả quyền được bảo lưu.
          </Text>
          <div className="flex flex-wrap mt-2 md:mt-0">
            <Link to="/privacy" className="text-white/80 hover:text-white text-sm mr-4 hover:no-underline">
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="text-white/80 hover:text-white text-sm mr-4 hover:no-underline">
              Điều khoản sử dụng
            </Link>
            <Link to="/sitemap" className="text-white/80 hover:text-white text-sm hover:no-underline">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;