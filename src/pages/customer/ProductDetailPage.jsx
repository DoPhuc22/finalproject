import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProductById } from '../../store/slices/productSlice';
import { Row, Col, Breadcrumb, Spin, Empty, Tabs } from 'antd';
import { HomeOutlined, TagOutlined, StarOutlined, CommentOutlined } from '@ant-design/icons';
import ProductImages from '../../components/customer/Products/Detail/ProductImages';
import ProductInfo from '../../components/customer/Products/Detail/ProductInfo';
import ProductParameters from '../../components/customer/Products/Detail/ProductParameters';
import ProductDescription from '../../components/customer/Products/Detail/ProductDescription';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = useSelector(state => selectProductById(state, id));
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Giả lập thời gian tải
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  if (!product) {
    return <Empty description="Không tìm thấy sản phẩm" />;
  }

  const tabItems = [
    {
      key: 'description',
      label: (
        <span className="flex items-center">
          <TagOutlined className="mr-1" />
          Mô tả chi tiết
        </span>
      ),
      children: <ProductDescription product={product} />,
    },
    {
      key: 'parameters',
      label: (
        <span className="flex items-center">
          <StarOutlined className="mr-1" />
          Thông số kỹ thuật
        </span>
      ),
      children: <ProductParameters product={product} />,
    },
    {
      key: 'reviews',
      label: (
        <span className="flex items-center">
          <CommentOutlined className="mr-1" />
          Đánh giá ({product.reviews || 0})
        </span>
      ),
      children: <div className="py-8">Tính năng đánh giá đang được phát triển</div>,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <Link to="/" className="hover:no-underline">
            <HomeOutlined /> Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/products" className="hover:no-underline">Đồng hồ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/products?category=${product.category}`} className="hover:no-underline">
            {product.category === 'mechanical' ? 'Đồng hồ cơ' : 
             product.category === 'smart' ? 'Đồng hồ thông minh' : 
             product.category === 'sport' ? 'Đồng hồ thể thao' : 'Đồng hồ cổ điển'}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Product Main Info */}
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={10}>
          <ProductImages product={product} />
        </Col>
        <Col xs={24} lg={14}>
          <ProductInfo product={product} />
        </Col>
      </Row>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs 
          defaultActiveKey="description" 
          items={tabItems}
          size="large"
          className="product-detail-tabs"
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;