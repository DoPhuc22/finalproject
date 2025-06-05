import React from "react";
import { Typography, Button, Carousel, Tag } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Banner = () => {
  // Carousel banner items
  const bannerItems = [
    {
      key: "1",
      title: "Đẳng Cấp Thời Gian",
      subtitle: "Bộ sưu tập đồng hồ cao cấp 2025",
      description:
        "Khám phá các thiết kế độc quyền dành riêng cho người sành điệu",
      image: "/assets/images/banners/luxury-banner.jpg",
      buttonText: "Khám phá ngay",
      buttonLink: "/products?category=luxury",
    },
    {
      key: "3",
      title: "Ưu đãi mùa hè",
      subtitle: "Giảm đến 40% cho đồng hồ thể thao",
      description:
        "Cơ hội sở hữu đồng hồ chất lượng với giá tốt nhất trong năm",
      image: "/assets/images/banners/sale-banner.jpg",
      buttonText: "Mua ngay",
      buttonLink: "/products?sale=true",
    },
  ];

  return (
    <Carousel autoplay effect="fade" className="banner-carousel">
      {bannerItems.map((item) => (
        <div key={item.key} className="relative">
          <div className="banner-slide relative h-[600px] overflow-hidden">
            {/* Fallback color in case image doesn't load */}
            <div className="absolute inset-0 bg-blue-900"></div>

            {/* Background image with overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{
                backgroundImage: `url(${item.image})`,
                filter: "brightness(0.7)",
              }}
            ></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center z-10">
              <div className="container mx-auto px-4 md:px-10">
                <div className="max-w-xl">
                  <Tag color="blue" className="mb-4">
                    {item.subtitle}
                  </Tag>
                  <Title level={1} className="text-white mb-4 drop-shadow-lg">
                    {item.title}
                  </Title>
                  <Paragraph className="text-white text-lg mb-8">
                    {item.description}
                  </Paragraph>
                  <Link to={item.buttonLink} className="hover:no-underline">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ArrowRightOutlined />}
                    >
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
  );
};

export default Banner;
