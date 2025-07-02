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
  // Calculate responsive columns based on product count
  const getColSpan = () => {
    if (products.length === 1) {
      return { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };
    } else if (products.length === 2) {
      return { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };
    } else if (products.length === 3) {
      return { xs: 24, sm: 12, md: 8, lg: 8, xl: 8 };
    }
    return { xs: 24, sm: 12, md: 8, lg: 8, xl: 6 };
  };

  const colSpan = getColSpan();

  return (
    <div className="product-grid">
      <div className={`
        ${products.length === 1 ? 'flex justify-center' : ''}
      `}>
        <Row gutter={[24, 24]} className={`
          ${products.length === 1 ? 'max-w-sm mx-auto' : 'w-full'}
        `}>
          {products.map((product) => (
            <Col 
              xs={colSpan.xs} 
              sm={colSpan.sm} 
              md={colSpan.md} 
              lg={colSpan.lg} 
              xl={colSpan.xl} 
              key={product.id || product.productId}
              className={`
                ${products.length === 1 ? 'max-w-xs' : ''}
              `}
            >
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart}
                cartLoading={cartLoading}
              />
            </Col>
          ))}
        </Row>
      </div>

      {pagination && pagination.total > 0 && (
        <div className="flex justify-center mt-8">
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
            pageSizeOptions={['8', '16', '32', '64']}
          />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;