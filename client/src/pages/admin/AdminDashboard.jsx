import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Products from './Products';
import Orders from './Orders';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/api/admin/dashboard');
        setStats(res.data);
      } catch {
        setStats(null);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-white shadow-sm min-h-screen">
            <nav className="mt-5 px-2">
              <Link
                to="/admin/dashboard"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 ${
                  isActiveRoute('/admin/dashboard') && !isActiveRoute('/admin/dashboard/products') && !isActiveRoute('/admin/dashboard/orders')
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              
              <Link
                to="/admin/dashboard/products"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 ${
                  isActiveRoute('/admin/dashboard/products')
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Products
              </Link>
              
              <Link
                to="/admin/dashboard/orders"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 ${
                  isActiveRoute('/admin/dashboard/orders')
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Orders
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <Routes>
              {/* Dashboard Overview */}
              <Route path="/" element={<DashboardOverview stats={stats} loading={loading} />} />
              
              {/* Products Management */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              
              {/* Orders Management */}
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats, loading }) => {
  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (!stats) return <div className="text-center py-8 text-red-600">Failed to load dashboard.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
          <div className="text-gray-600">Users</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.totalProducts}</div>
          <div className="text-gray-600">Products</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.totalOrders}</div>
          <div className="text-gray-600">Orders</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">₹{stats.totalSales}</div>
          <div className="text-gray-600">Total Sales</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
        </div>
        <div className="p-6">
          {stats.recentOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No recent orders.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold">User</th>
                    <th className="text-left py-3 px-4 font-semibold">Total</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id} className="border-b border-gray-100">
                      <td className="py-3 px-4">{order._id}</td>
                      <td className="py-3 px-4">{order.user?.name || 'N/A'}</td>
                      <td className="py-3 px-4">₹{order.total}</td>
                      <td className="py-3 px-4">{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 