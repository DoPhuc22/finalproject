import React from 'react';
import { Typography, Button, Row, Col, Divider } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const AboutSection = () => {
  return (
    <div className="py-16 container mx-auto px-4">
      <Row gutter={[48, 24]} align="middle">
        <Col xs={24} lg={12}>
          <div className="about-image relative">
            <img 
              src="/assets/images/about-store.jpg" 
              alt="Watch Store" 
              className="rounded-lg shadow-lg w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg hidden md:block">
              <Title level={4} className="text-white m-0">Thành lập từ 2010</Title>
              <Divider className="bg-white/20 my-4" />
              <Text className="text-white">Hơn 15 năm kinh nghiệm</Text>
            </div>
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <Title level={2}>Về Watch Store</Title>
          <Title level={5} className="text-blue-600 font-normal mb-6">
            "Thời gian quý giá, hãy để chúng tôi giúp bạn giữ gìn nó!"
          </Title>
          <Paragraph className="text-lg">
            Watch Store là cửa hàng chuyên cung cấp các mẫu đồng hồ đeo tay chất lượng cao với thiết kế hiện đại và phong cách.
            Chúng tôi tự hào là đại lý chính hãng của nhiều thương hiệu đồng hồ nổi tiếng thế giới.
          </Paragraph>
          <Paragraph className="text-lg mb-8">
            Với đội ngũ chuyên viên tư vấn giàu kinh nghiệm, chúng tôi cam kết mang đến cho khách hàng những sản phẩm
            chính hãng với giá cả cạnh tranh nhất và dịch vụ hậu mãi tận tâm.
          </Paragraph>
          <Link to="/about" className='hover:no-underline'>
            <Button type="primary" size="large">Tìm hiểu thêm</Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default AboutSection;