import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

// Fetch user's cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/cart/add', { productId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// Place order
export const placeOrder = createAsyncThunk(
  'cart/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place order');
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/cart/remove', { productId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/cart/update', { productId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update item');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    orderSuccess: false,
    lastOrder: null,
  },
  reducers: {
    // Add the clearOrderSuccess reducer
    clearOrderSuccess: (state) => {
      state.orderSuccess = false;
      state.lastOrder = null;
      state.error = null;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Cart fetch failed:', action.payload);
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderSuccess = true;
        state.lastOrder = action.payload.order;
        // Only clear cart items on successful order
        state.items = [];
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderSuccess = false;
        // Don't clear cart items on error
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;

        // Safely get the updated quantity from the meta arg
        const { productId, quantity } = action.meta.arg;

        const itemIndex = state.items.findIndex(item => item.product._id === productId);
        if (itemIndex !== -1) {
          state.items[itemIndex].quantity = quantity;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearOrderSuccess, clearError } = cartSlice.actions;

export default cartSlice.reducer;