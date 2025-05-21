import React from 'react';
import Banner from '../../components/customer/Home/Banner';
import FeaturedProducts from '../../components/customer/Home/FeaturedProducts';
import Categories from '../../components/customer/Home/Categories';
import AboutSection from '../../components/customer/Home/AboutSection';
import Testimonials from '../../components/customer/Home/Testimonials';
import PromoSection from '../../components/customer/Home/PromoSection';
import { Col, Row, Typography } from 'antd';
import { ClockCircleOutlined, SafetyCertificateOutlined, TagOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Banner Carousel */}
      <Banner />

      {/* USP Section */}
      <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Row gutter={[24, 24]} className="text-center">
          <Col xs={24} sm={12} md={6}>
            <div className="p-4">
              <ClockCircleOutlined className="text-4xl text-blue-600 mb-3" />
              <Title level={4}>Hàng Chính Hãng</Title>
              <Text type="secondary">100% sản phẩm có giấy chứng nhận và bảo hành toàn cầu</Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="p-4">
              <TagOutlined className="text-4xl text-blue-600 mb-3" />
              <Title level={4}>Giá Tốt Nhất</Title>
              <Text type="secondary">Cam kết giá tốt nhất thị trường với các chương trình ưu đãi</Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="p-4">
              <TrophyOutlined className="text-4xl text-blue-600 mb-3" />
              <Title level={4}>Hậu Mãi Tận Tâm</Title>
              <Text type="secondary">Chế độ bảo hành và chăm sóc khách hàng lên đến 5 năm</Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="p-4">
              <SafetyCertificateOutlined className="text-4xl text-blue-600 mb-3" />
              <Title level={4}>Thanh Toán An Toàn</Title>
              <Text type="secondary">Nhiều phương thức thanh toán bảo mật và tiện lợi</Text>
            </div>
          </Col>
        </Row>
      </div>
    </div>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Categories */}
      <Categories />

      {/* About Section */}
      <AboutSection />

      {/* Testimonials */}
      <Testimonials />

      {/* Promo Section */}
      {/* <PromoSection /> */}

      {/* Custom styles for this page */}
      <style jsx>{`
        .banner-carousel .slick-dots li button {
          background: white !important;
          opacity: 0.5;
        }
        .banner-carousel .slick-dots li.slick-active button {
          opacity: 1;
        }
        .product-card:hover .ant-card-cover img {
          transform: scale(1.1);
        }
        .category-card:hover img {
          transform: scale(1.1);
        }
        .testimonial-card {
          transition: transform 0.3s;
        }
        .testimonial-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default HomePage;