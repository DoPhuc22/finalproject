import React from 'react';
import { Typography, Card, Row, Col, Rate, Avatar } from 'antd';

const { Title, Text, Paragraph } = Typography;

const Testimonials = () => {
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: '/assets/images/avatars/avatar1.jpg',
      role: 'Doanh nhân',
      rating: 5,
      content: 'Đồng hồ Omega tôi mua từ Watch Store có chất lượng xuất sắc và dịch vụ hậu mãi tuyệt vời. Nhân viên tư vấn rất nhiệt tình và am hiểu sản phẩm.',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: '/assets/images/avatars/avatar2.jpg',
      role: 'Giáo viên',
      rating: 4.5,
      content: 'Tôi rất hài lòng với chiếc đồng hồ thông minh mới. Giao diện dễ sử dụng và pin trâu hơn tôi nghĩ. Cửa hàng có dịch vụ giao hàng nhanh chóng.',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      avatar: '/assets/images/avatars/avatar3.jpg',
      role: 'Kỹ sư IT',
      rating: 5,
      content: 'Watch Store là điểm đến lý tưởng cho người đam mê đồng hồ như tôi. Sản phẩm đa dạng, chính hãng và có nhiều ưu đãi hấp dẫn.',
    },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-12">Khách Hàng Nói Gì Về Chúng Tôi</Title>
        
        <Row gutter={[24, 24]}>
          {testimonials.map(testimonial => (
            <Col xs={24} md={8} key={testimonial.id}>
              <Card className="h-full testimonial-card">
                <Rate allowHalf disabled value={testimonial.rating} className="mb-4" />
                <Paragraph className="text-lg italic mb-6">"{testimonial.content}"</Paragraph>
                <div className="flex items-center">
                  <Avatar src={testimonial.avatar} size={64} />
                  <div className="ml-4">
                    <Text strong className="block">{testimonial.name}</Text>
                    <Text type="secondary">{testimonial.role}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Testimonials;