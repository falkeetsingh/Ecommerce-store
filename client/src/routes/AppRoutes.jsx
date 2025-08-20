import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Product from '../pages/Product';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import ScrollToTop from '../components/ScrollToTop';
import AdminDashboard from '../pages/admin/AdminDashboard';
import OrderHistory from '../pages/OrderHistory';
import Profile from '../pages/Profile';
import Wishlist from '../pages/Wishlist';
import ProtectedRoute from '../components/ProtectedRoute';
import VerifyEmail from '../components/VerifyEmail';

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Product />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }/>
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>} />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/verify-email' element={<VerifyEmail/>}/>
      </Routes>
    </>
  );
};

export default AppRoutes;
