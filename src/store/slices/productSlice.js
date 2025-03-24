import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk action để fetch tất cả sản phẩm
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get('https://api.example.com/products');
    return response.data;
  }
);

// Thunk action để fetch sản phẩm theo id
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId) => {
    const response = await axios.get(`https://api.example.com/products/${productId}`);
    return response.data;
  }
);

// Đường dẫn hình ảnh mặc định cho tất cả sản phẩm
const defaultImageUrl = '/src/assets/images/products/watch.jpg';

// Dữ liệu mẫu cho các sản phẩm
const initialProducts = [
  {
    id: '1',
    name: 'Đồng hồ cơ Luxury Pro',
    description: 'Đồng hồ cơ cao cấp với thiết kế sang trọng, phù hợp cho các dịp quan trọng và trang phục công sở.',
    price: 1299000,
    imageUrl: defaultImageUrl,
    category: 'mechanical',
    brand: 'Omega',
    inStock: true,
    rating: 4.8,
    reviews: 24
  },
  {
    id: '2',
    name: 'Đồng hồ thể thao Active',
    description: 'Đồng hồ thể thao bền bỉ, chống nước, phù hợp cho các hoạt động ngoài trời và thể thao.',
    price: 899000,
    imageUrl: defaultImageUrl,
    category: 'sport',
    brand: 'Casio',
    inStock: true,
    rating: 4.5,
    reviews: 18
  },
  {
    id: '3',
    name: 'Smartwatch X5',
    description: 'Đồng hồ thông minh với nhiều tính năng hiện đại, theo dõi sức khỏe và kết nối với điện thoại.',
    price: 2499000, 
    imageUrl: defaultImageUrl,
    category: 'smart',
    brand: 'Apple',
    inStock: true,
    rating: 4.9,
    reviews: 56
  },
  {
    id: '4',
    name: 'Đồng hồ Vintage Classic',
    description: 'Đồng hồ thiết kế cổ điển, mang phong cách vintage nhưng vẫn giữ được nét hiện đại.',
    price: 749000,
    imageUrl: defaultImageUrl,
    category: 'classic',
    brand: 'Seiko',
    inStock: false,
    rating: 4.6,
    reviews: 12
  }
];

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: initialProducts,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    selectedProduct: null
  },
  reducers: {
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(product => product.id !== action.payload);
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Selectors
export const selectAllProducts = state => state.products.items;
export const selectProductById = (state, productId) => 
  state.products.items.find(product => product.id === productId);
export const selectProductsByCategory = (state, category) => 
  state.products.items.filter(product => product.category === category);
export const selectProductStatus = state => state.products.status;
export const selectProductError = state => state.products.error;

// Memoized selector để lọc sản phẩm theo tiêu chí
export const selectFilteredProducts = createSelector(
  [selectAllProducts, (_, filters) => filters],
  (products, filters) => {
    if (!filters) return products;
    
    return products.filter(product => {
      let matches = true;
      if (filters.category) {
        matches = matches && product.category === filters.category;
      }
      if (filters.priceRange) {
        matches = matches && 
          product.price >= filters.priceRange[0] && 
          product.price <= filters.priceRange[1];
      }
      if (filters.brand && filters.brand.length > 0) {
        matches = matches && filters.brand.includes(product.brand);
      }
      if (filters.inStock !== undefined) {
        matches = matches && product.inStock === filters.inStock;
      }
      return matches;
    });
  }
);

export const { addProduct, updateProduct, deleteProduct, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;