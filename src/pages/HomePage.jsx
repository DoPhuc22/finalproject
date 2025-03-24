import React from 'react';
import { Typography, Button, Carousel, Card, Row, Col, Space, Divider, Rate, Avatar, Tag } from 'antd';
import { ArrowRightOutlined, ClockCircleOutlined, TagOutlined, TrophyOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllProducts } from '../store/slices/productSlice';

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const HomePage = () => {
  const allProducts = useSelector(selectAllProducts);
  const featuredProducts = allProducts.slice(0, 4);

  // Carousel banner items
  const bannerItems = [
    {
      key: '1',
      title: 'Đẳng Cấp Thời Gian',
      subtitle: 'Bộ sưu tập đồng hồ cao cấp 2025',
      description: 'Khám phá các thiết kế độc quyền dành riêng cho người sành điệu',
      image: '/assets/images/banners/luxury-banner.jpg',
      buttonText: 'Khám phá ngay',
      buttonLink: '/products?category=luxury',
    },
    {
      key: '2',
      title: 'Smartwatch Collection',
      subtitle: 'Công nghệ đeo tay thông minh',
      description: 'Kết nối cuộc sống của bạn với thế giới công nghệ hiện đại',
      image: '/assets/images/banners/smart-banner.jpg',
      buttonText: 'Xem bộ sưu tập',
      buttonLink: '/products?category=smart',
    },
    {
      key: '3',
      title: 'Ưu đãi mùa hè',
      subtitle: 'Giảm đến 40% cho đồng hồ thể thao',
      description: 'Cơ hội sở hữu đồng hồ chất lượng với giá tốt nhất trong năm',
      image: '/assets/images/banners/sale-banner.jpg',
      buttonText: 'Mua ngay',
      buttonLink: '/products?sale=true',
    },
  ];

  // Categories
  const categories = [
    { id: 1, name: 'Đồng hồ cơ', image: '/assets/images/products/watch.jpg', count: 24 },
    { id: 2, name: 'Đồng hồ thể thao', image: '/assets/images/products/watch.jpg', count: 18 },
    { id: 3, name: 'Đồng hồ thông minh', image: '/assets/images/products/watch.jpg', count: 32 },
    { id: 4, name: 'Đồng hồ sang trọng', image: '/assets/images/products/watch.jpg', count: 15 },
  ];

  // Testimonials
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
    <div className="home-page">
      {/* Hero Banner Carousel */}
      <Carousel autoplay effect="fade" className="banner-carousel">
        {bannerItems.map(item => (
          <div key={item.key} className="relative">
            <div className="banner-slide relative h-[600px] overflow-hidden">
              {/* Fallback color in case image doesn't load */}
              <div className="absolute inset-0 bg-blue-900"></div>
              
              {/* Background image with overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ 
                  backgroundImage: `url(${item.image})`, 
                  filter: 'brightness(0.7)'
                }}
              ></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center z-10">
                <div className="container mx-auto px-4 md:px-10">
                  <div className="max-w-xl text-white">
                    <Tag color="blue" className="mb-4">{item.subtitle}</Tag>
                    <Title level={1} className="text-white mb-4 drop-shadow-lg">{item.title}</Title>
                    <Paragraph className="text-white text-lg mb-8">{item.description}</Paragraph>
                    <Link to={item.buttonLink} className='hover:no-underline'> 
                      <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                        {item.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

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
      <div className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Title level={2} className="m-0">Sản Phẩm Nổi Bật</Title>
          <Link to="/products" className='hover:no-underline'>
            <Button type="link" icon={<ArrowRightOutlined />}>Xem tất cả</Button>
          </Link>
        </div>
        
        <Row gutter={[24, 24]}>
          {featuredProducts.map(product => (
            <Col xs={24} sm={12} lg={6} key={product.id}>
              <Link to={`/products/${product.id}`} className='hover:no-underline'>
                <Card
                  hoverable
                  cover={
                    <div className="h-60 overflow-hidden">
                      <img 
                        alt={product.name} 
                        src={product.imageUrl} 
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                      />
                    </div>
                  }
                  className="h-full product-card"
                >
                  <Meta
                    title={product.name}
                    description={
                      <div>
                        <Rate allowHalf disabled defaultValue={product.rating} className="text-sm mb-2" />
                        <div className="flex justify-between items-center">
                          <Text strong className="text-lg text-blue-600">
                            {product.price.toLocaleString()} VNĐ
                          </Text>
                          <Tag color={product.inStock ? 'success' : 'error'}>
                            {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                          </Tag>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Title level={2} className="text-center mb-12">Danh Mục Sản Phẩm</Title>
          
          <Row gutter={[24, 24]}>
            {categories.map(category => (
              <Col xs={24} sm={12} lg={6} key={category.id}>
                <Link to={`/products?category=${category.name}`} className='hover:no-underline'>
                  <Card 
                    hoverable 
                    className="category-card overflow-hidden"
                    cover={
                      <div className="relative h-48">
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <div className="p-4 text-white w-full">
                            <Text className="text-lg font-bold block">{category.name}</Text>
                            <Text className="text-white/80">{category.count} sản phẩm</Text>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* About Section */}
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

      {/* Testimonials */}
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

      {/* Promo Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Title level={2} className="text-white mb-4">Ưu Đãi Đặc Biệt</Title>
          <Paragraph className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Đăng ký nhận thông tin để không bỏ lỡ những ưu đãi độc quyền và bộ sưu tập mới nhất từ Watch Store
          </Paragraph>
          <Space direction="horizontal" size="large">
            <Button size="large" type="default" ghost>
              <Link to="/products?sale=true" className='hover:no-underline'>Xem khuyến mãi</Link>
            </Button>
            <Button size="large" type="primary" className="bg-white text-blue-600 border-white hover:bg-gray-100">
              <Link to="/register" className='hover:no-underline'>Đăng ký ngay</Link>
            </Button>
          </Space>
        </div>
      </div>

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