import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../../components/customer/Products/ProductDetail';
import { useSelector } from 'react-redux';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = useSelector((state) => state.products.find((p) => p.id === id));

  return (
    <div className="container mx-auto p-4">
      {product ? (
        <ProductDetail product={product} />
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default ProductDetailPage;