// pages/customer/ProductDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Breadcrumb, Spin, Empty, Tabs, Alert } from 'antd';
import { HomeOutlined, TagOutlined, StarOutlined, CommentOutlined } from '@ant-design/icons';
import ProductImages from '../../components/customer/Products/Detail/ProductImages';
import ProductInfo from '../../components/customer/Products/Detail/ProductInfo';
import ProductParameters from '../../components/customer/Products/Detail/ProductParameters';
import ProductDescription from '../../components/customer/Products/Detail/ProductDescription';
import useProductDetail from '../../hooks/useProductDetail';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { product, images, attributes, loading, error } = useProductDetail(id);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty description="Không tìm thấy sản phẩm" />
      </div>
    );
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
      children: <ProductParameters product={product} attributes={attributes} />,
    },
    {
      key: 'reviews',
      label: (
        <span className="flex items-center">
          <CommentOutlined className="mr-1" />
          Đánh giá ({product.reviewCount || 0})
        </span>
      ),
      children: <div className="py-8">Tính năng đánh giá đang được phát triển</div>,
    },
  ];

  // Lấy tên danh mục
  const getCategoryName = () => {
    const categoryMap = {
      'mechanical': 'Đồng hồ cơ',
      'smart': 'Đồng hồ thông minh',
      'sport': 'Đồng hồ thể thao',
      'classic': 'Đồng hồ cổ điển'
    };
    
    if (product.category?.name) return product.category.name;
    if (product.categoryName) return product.categoryName;
    
    const categoryId = product.categoryId || product.category;
    return categoryMap[categoryId] || 'Đồng hồ';
  };

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
          <Link to={`/products?category=${product.categoryId || product.category}`} className="hover:no-underline">
            {getCategoryName()}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Product Main Info */}
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={10}>
          <ProductImages product={product} images={images} />
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