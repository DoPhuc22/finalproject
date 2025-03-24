import React from 'react';
import { Row, Col, Spin, Empty, Pagination } from 'antd';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading = false, pagination = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <Empty description="Không tìm thấy sản phẩm nào" className="py-10" />;
  }

  return (
    <div className="product-grid">
      <Row gutter={[24, 24]}>
        {products.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      
      {pagination && products.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            defaultCurrent={1}
            total={products.length}
            defaultPageSize={8}
            showSizeChanger
            showTotal={(total) => `Tổng cộng ${total} sản phẩm`}
          />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;