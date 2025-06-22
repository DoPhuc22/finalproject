// hooks/useProductDetail.js
import { useState, useEffect } from 'react';
import { getProductById, getProductAttributeValues, getProductImages } from '../services/products';
import { message } from 'antd';

const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch product details
        const productResponse = await getProductById(productId);
        const productData = productResponse.data || productResponse;

        // Fetch product images
        const imagesResponse = await getProductImages(productId);
        const imagesData = imagesResponse.data || imagesResponse || [];

        // Fetch product attributes
        const attributesResponse = await getProductAttributeValues(productId);
        const attributesData = attributesResponse.data || attributesResponse || [];

        // Prepare primary image URL
        const primaryImage = imagesData.find(img => img.isPrimary) || imagesData[0] || {};
        
        // Create complete product object
        const completeProduct = {
          ...productData,
          imageUrl: primaryImage.imageUrl || '/assets/images/products/default.jpg',
          images: imagesData,
          attributes: attributesData
        };

        setProduct(completeProduct);
        setImages(imagesData);
        setAttributes(attributesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        message.error('Có lỗi xảy ra khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  return { product, images, attributes, loading, error };
};

export default useProductDetail;