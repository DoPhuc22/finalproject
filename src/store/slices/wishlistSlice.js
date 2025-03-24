import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push(newItem);
      }
    },
    
    removeFromWishlist(state, action) {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    },
    
    clearWishlist(state) {
      state.items = [];
    },

    toggleWishlistItem(state, action) {
      const id = action.payload.id;
      const existingIndex = state.items.findIndex(item => item.id === id);
      
      if (existingIndex >= 0) {
        // Remove if exists
        state.items.splice(existingIndex, 1);
      } else {
        // Add if doesn't exist
        state.items.push(action.payload);
      }
    },

    moveToCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    }
  }
});

// Selectors
export const selectWishlistItems = state => state.wishlist.items;
export const selectWishlistItemCount = state => state.wishlist.items.length;
export const selectIsInWishlist = (state, productId) => 
  state.wishlist.items.some(item => item.id === productId);

export const { addToWishlist, removeFromWishlist, clearWishlist, toggleWishlistItem, moveToCart } = wishlistSlice.actions;
export default wishlistSlice.reducer;