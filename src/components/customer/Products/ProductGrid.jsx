// components/customer/Products/ProductGrid.jsx
import React from "react";
import { Row, Col, Pagination } from "antd";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products = [],
  pagination,
  onPageChange = () => {},
}) => {
  return (
    <div className="product-grid">
      <Row gutter={[24, 24]}>
        {products.map((product) => (
          <Col xs={24} sm={12} lg={8} key={product.id || product.productId}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {pagination && pagination.total > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={pagination.current}
            total={pagination.total}
            pageSize={pagination.pageSize}
            pageSizeOptions={["9", "18", "27", "36"]} // Các tùy chọn size phù hợp với layout 3 cột
            showSizeChanger
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`
            }
            onChange={(page, pageSize) => onPageChange(page, pageSize)}
            showQuickJumper
          />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
