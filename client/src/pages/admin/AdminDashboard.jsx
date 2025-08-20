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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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


  const navigationItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: '📊',
      isExact: true
    },
    {
      path: '/admin/dashboard/products',
      name: 'Products',
      icon: '📦',
      isExact: false
    },
    {
      path: '/admin/dashboard/orders',
      name: 'Orders',
      icon: '🛍️',
      isExact: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Enhanced Sidebar Navigation */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out border-r border-slate-200 dark:border-slate-700`}>
          
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Admin Portal</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Management Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = item.isExact 
                ? location.pathname === item.path || (location.pathname === '/admin/dashboard' && item.path === '/admin/dashboard')
                : location.pathname.includes(item.path.split('/').pop());
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-4 px-4 py-4 rounded-2xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 shadow-inner' 
                      : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30'
                  }`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <span className="text-lg">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">Administrator</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">System Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                  >
                    <span className="text-xl">☰</span>
                  </button>
                  
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-indigo-700 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
                      Admin Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                      Manage your e-commerce platform
                    </p>
                  </div>
                </div>

                {/* Quick Stats Pills */}
                <div className="hidden md:flex items-center gap-3">
                  {stats && (
                    <>
                      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-700/50 px-4 py-2 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 dark:text-blue-400 text-sm">👥</span>
                          <span className="text-blue-700 dark:text-blue-300 font-semibold">{stats.totalUsers}</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-200 dark:border-emerald-700/50 px-4 py-2 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 dark:text-emerald-400 text-sm">📦</span>
                          <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{stats.totalProducts}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
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

// Enhanced Dashboard Overview Component
const DashboardOverview = ({ stats, loading }) => {
  if (loading) return (
    <div className="text-center py-16">
      <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50">
        <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
        <span className="text-xl font-medium text-slate-700 dark:text-slate-200">Loading dashboard...</span>
      </div>
    </div>
  );
  
  if (!stats) return (
    <div className="text-center py-16">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-12 rounded-3xl shadow-xl border border-red-200 dark:border-red-700/50 max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Dashboard Unavailable</h3>
        <p className="text-red-600 dark:text-red-400 text-lg">Failed to load dashboard data</p>
      </div>
    </div>
  );

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700/50'
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-700/50'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: '🛍️',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700/50'
    },
    {
      title: 'Total Sales',
      value: `₹${stats.totalSales?.toLocaleString()}`,
      icon: '💰',
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      borderColor: 'border-orange-200 dark:border-orange-700/50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 dark:from-white dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent mb-4">
          Dashboard Overview
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Monitor your business performance at a glance
        </p>
      </div>
      
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsCards.map((card, index) => (
          <div 
            key={card.title}
            className={`group bg-gradient-to-br ${card.bgColor} backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border ${card.borderColor}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white text-2xl">{card.icon}</span>
              </div>
              <div className="text-right">
                <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.value}
                </div>
              </div>
            </div>
            <div className="text-slate-700 dark:text-slate-300 font-semibold text-lg">
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Recent Orders */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-8 py-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl">📋</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Recent Orders</h3>
              <p className="text-slate-600 dark:text-slate-400">Latest customer transactions</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl opacity-50">📝</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No Recent Orders</h4>
              <p className="text-slate-500 dark:text-slate-500">Orders will appear here when customers make purchases</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-600">
                    <th className="text-left py-4 px-6 font-bold text-slate-700 dark:text-slate-300">Order ID</th>
                    <th className="text-left py-4 px-6 font-bold text-slate-700 dark:text-slate-300">Customer</th>
                    <th className="text-left py-4 px-6 font-bold text-slate-700 dark:text-slate-300">Amount</th>
                    <th className="text-left py-4 px-6 font-bold text-slate-700 dark:text-slate-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order, index) => (
                    <tr 
                      key={order._id} 
                      className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
                    >
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-bold">#{index + 1}</span>
                          </div>
                          <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                            {order._id.slice(-8)}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                            <span className="text-emerald-600 dark:text-emerald-400">👤</span>
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-white">
                            {order.user?.name || 'Guest User'}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-700/50 inline-block">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">
                            ₹{order.total?.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-slate-600 dark:text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="text-sm text-slate-500 dark:text-slate-500">
                          {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
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