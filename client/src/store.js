// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './features/auth/authSlice';
import productReducer from './features/products/productSlice';
import cartReducer from './features/cart/cartSlice';
import orderReducer from './features/order/orderSlice';
import reviewReducer from './features/review/reviewSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer, // ✅ Only this will be persisted
  order: orderReducer,
  review: reviewReducer,
  wishlist: wishlistReducer,
});

// Persist config — only for cart
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // ✅ Only persist the 'cart' slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
