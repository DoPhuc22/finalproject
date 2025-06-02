import api from '../utils/request';

// API endpoints cho reviews
const REVIEW_ENDPOINTS = {
  BASE: '/reviews',
  BY_ID: (id) => `/reviews/${id}`,
  BY_PRODUCT: (productId) => `/reviews/product/${productId}`,
};

// Lấy thông tin review theo ID
export const getReviewById = async (id) => {
  try {
    const response = await api.get(REVIEW_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Cập nhật review
export const updateReview = async (id, reviewData) => {
  try {
    const response = await api.put(REVIEW_ENDPOINTS.BY_ID(id), {
      reviewId: reviewData.reviewId,
      userId: reviewData.userId,
      productId: reviewData.productId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: reviewData.createdAt
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Xóa review
export const deleteReview = async (id) => {
  try {
    const response = await api.delete(REVIEW_ENDPOINTS.BY_ID(id));
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tất cả reviews
export const getAllReviews = async () => {
  try {
    const response = await api.get(REVIEW_ENDPOINTS.BASE);
    return response;
  } catch (error) {
    throw error;
  }
};

// Tạo review mới
export const createReview = async (reviewData) => {
  try {
    const response = await api.post(REVIEW_ENDPOINTS.BASE, {
      reviewId: reviewData.reviewId,
      userId: reviewData.userId,
      productId: reviewData.productId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: reviewData.createdAt
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Lấy reviews theo product ID
export const getReviewsByProduct = async (productId) => {
  try {
    const response = await api.get(REVIEW_ENDPOINTS.BY_PRODUCT(productId));
    return response;
  } catch (error) {
    throw error;
  }
};