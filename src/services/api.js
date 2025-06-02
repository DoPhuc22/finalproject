// Import tất cả API services
export * from './users';
export * from './products';
export * from './categories';
export * from './brands.js';
export * from './reviews';
export * from './cart';
export * from './orders';
export * from './checkout';
export * from './discounts';
export * from './attributes';

// Import các service đã có
export * as authAPI from '../auth';

// Tạo object chứa tất cả APIs được nhóm theo chức năng
export const API = {
  // Authentication
  auth: {
    login: authAPI.login,
    register: authAPI.register,
    logout: authAPI.logout,
    forgotPassword: authAPI.forgotPassword,
    resetPassword: authAPI.resetPassword,
    getCurrentUser: authAPI.getCurrentUser,
    isAuthenticated: authAPI.isAuthenticated,
    getToken: authAPI.getToken,
  },
  
  // Users management
  users: {
    getById: require('./users').getUserById,
    getAll: require('./users').getAllUsers,
    create: require('./users').createUser,
    update: require('./users').updateUser,
    delete: require('./users').deleteUser,
  },
  
  // Products management
  products: {
    getById: require('./products').getProductById,
    getAll: require('./products').getAllProducts,
    create: require('./products').createProduct,
    update: require('./products').updateProduct,
    delete: require('./products').deleteProduct,
    search: require('./products').searchProductsAdvanced,
    getByCategory: require('./products').getProductsByCategory,
    getByBrand: require('./products').getProductsByBrand,
    getCategories: require('./products').getProductCategories,
    getBrands: require('./products').getProductBrands,
    
    // Images
    images: {
      getById: require('./products').getProductImage,
      getAll: require('./products').getProductImages,
      create: require('./products').addProductImage,
      update: require('./products').updateProductImage,
      delete: require('./products').deleteProductImage,
    },
    
    // Attributes
    attributes: {
      getById: require('./products').getProductAttributeValue,
      getAll: require('./products').getProductAttributeValues,
      create: require('./products').addProductAttributeValue,
      update: require('./products').updateProductAttributeValue,
      delete: require('./products').deleteProductAttributeValue,
      getTypes: require('./products').getProductAttributes,
    }
  },
  
  // Categories
  categories: {
    getById: require('./categories').getCategoryById,
    getAll: require('./categories').getAllCategories,
    create: require('./categories').createCategory,
    update: require('./categories').updateCategory,
    delete: require('./categories').deleteCategory,
  },
  
  // Brands
  brands: {
    getById: require('./brands.js').getBrandById,
    getAll: require('./brands.js').getAllBrands,
    create: require('./brands.js').createBrand,
    update: require('./brands.js').updateBrand,
    delete: require('./brands.js').deleteBrand,
  },
  
  // Reviews
  reviews: {
    getById: require('./reviews').getReviewById,
    getAll: require('./reviews').getAllReviews,
    create: require('./reviews').createReview,
    update: require('./reviews').updateReview,
    delete: require('./reviews').deleteReview,
    getByProduct: require('./reviews').getReviewsByProduct,
  },
  
  // Cart
  cart: {
    get: require('./cart').getUserCart,
    add: require('./cart').addToCart,
    update: require('./cart').updateCartItem,
    remove: require('./cart').removeCartItem,
    clear: require('./cart').clearCart,
  },
  
  // Orders
  orders: {
    getById: require('./orders').getOrderById,
    getAll: require('./orders').getAllOrders,
    create: require('./orders').createOrder,
    update: require('./orders').updateOrder,
    delete: require('./orders').deleteOrder,
  },
  
  // Checkout
  checkout: {
    process: require('./checkout').processCheckout,
    validateDiscount: require('./checkout').validateDiscountCode,
    calculateTotal: require('./checkout').calculateCheckoutTotal,
  },
  
  // Discounts
  discounts: {
    getById: require('./discounts').getDiscountById,
    getAll: require('./discounts').getAllDiscounts,
    create: require('./discounts').createDiscount,
    update: require('./discounts').updateDiscount,
    delete: require('./discounts').deleteDiscount,
  },
  
  // Attribute Types
  attributeTypes: {
    getById: require('./attributes').getAttributeTypeById,
    getAll: require('./attributes').getAllAttributeTypes,
    create: require('./attributes').createAttributeType,
    update: require('./attributes').updateAttributeType,
    delete: require('./attributes').deleteAttributeType,
  },
};

export default API;