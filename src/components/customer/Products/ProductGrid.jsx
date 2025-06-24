import React from 'react';
import { Row, Col, Pagination } from 'antd';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products, 
  pagination, 
  onPageChange, 
  onAddToCart, 
  cartLoading 
}) => {
  return (
    <div className="product-grid">
      <Row gutter={[24, 24]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={6} key={product.id || product.productId}>
            <ProductCard 
              product={product} 
              onAddToCart={onAddToCart}
              cartLoading={cartLoading}
            />
          </Col>
        ))}
      </Row>

      {pagination && pagination.total > 0 && (
        <div className="text-center mt-8">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={onPageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`
            }
            pageSizeOptions={['6', '12', '24', '48']}
          />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;