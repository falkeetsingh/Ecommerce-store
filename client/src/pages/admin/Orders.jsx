import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { 
  BiSearch, 
  BiFilter, 
  BiListUl, 
  BiGrid, 
  BiUser, 
  BiPackage, 
  // BiDollar, 
  BiCalendar,
  BiCheck,
  BiX,
  BiSolidTruck,
  BiTime,
  BiCheckCircle,
  BiXCircle,
  BiShoppingBag,
  BiReceipt,
  BiPhone,
  BiEnvelope,
  BiMapPin,
  BiRefresh,
  BiTrendingUp
} from 'react-icons/bi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/api/orders/all');
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      console.log('Updating order status:', { id, status });
      const res = await axiosInstance.patch(`/api/orders/${id}/status`, { status });
      setOrders(orders.map(order =>
        order._id === id ? { ...order, status: res.data.status } : order
      ));
      console.log('Status updated successfully to:', res.data.status);
    } catch (error) {
      console.error('Failed to update status:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'; 
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200'; 
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status || 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return BiTime;
      case 'confirmed': return BiCheck;
      case 'shipped': return BiSolidTruck;
      case 'delivered': return BiCheckCircle;
      case 'cancelled': return BiXCircle;
      default: return BiTime;
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = searchTerm === '' || 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.name || order.address?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.email || order.address?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredOrders.map(order => {
        const StatusIcon = getStatusIcon(order.status);
        
        return (
          <div key={order._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BiReceipt className="text-blue-600" />
                  <span className="font-mono text-sm font-medium text-gray-900">
                    #{order._id.slice(-8)}
                  </span>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  <StatusIcon className="mr-1" />
                  {getStatusDisplayName(order.status)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Customer Info */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <BiUser className="text-gray-400 mr-2" />
                  <span className="font-medium text-gray-900">
                    {order.user?.name || order.address?.fullName || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <BiEnvelope className="mr-2" />
                  <span>{order.user?.email || order.address?.email || 'N/A'}</span>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <BiPackage className="text-blue-600 mr-1" />
                    <span className="text-lg font-bold text-blue-600">{order.items?.length || 0}</span>
                  </div>
                  <span className="text-xs text-gray-500">Items</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-lg font-bold text-green-600">₹{order.total}</span>
                  </div>
                  <span className="text-xs text-gray-500">Total</span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-1">Items:</div>
                <div className="text-sm text-gray-600">
                  {order.items?.slice(0, 2).map(item => item.product?.name).join(', ')}
                  {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <BiCalendar className="mr-2" />
                <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(order._id, 'confirmed')}
                      className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
                    >
                      <BiCheck className="mr-1" />
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(order._id, 'cancelled')}
                      className="bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                    >
                      <BiX />
                    </button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(order._id, 'shipped')}
                    className="w-full bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                  >
                    <BiTruck className="mr-2" />
                    Ship Order
                  </button>
                )}
                {order.status === 'shipped' && (
                  <button
                    onClick={() => updateStatus(order._id, 'delivered')}
                    className="w-full bg-purple-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center"
                  >
                    <BiCheckCircle className="mr-2" />
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">
                <div className="flex items-center">
                  <BiReceipt className="mr-2" />
                  Order ID
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">
                <div className="flex items-center">
                  <BiUser className="mr-2" />
                  Customer
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">
                <div className="flex items-center">
                  <BiPackage className="mr-2" />
                  Items
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">
                <div className="flex items-center">
                  {/* <BiDollar className="mr-2" /> */}
                  Total
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">
                <div className="flex items-center">
                  <BiCalendar className="mr-2" />
                  Date
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-6 font-mono text-sm font-medium">#{order._id.slice(-8)}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{order.user?.name || order.address?.fullName || 'N/A'}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <BiEnvelope className="mr-1" />
                        {order.user?.email || order.address?.email || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div className="font-medium flex items-center">
                        <BiPackage className="mr-1 text-blue-600" />
                        {order.items?.length || 0} items
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {order.items?.slice(0, 2).map(item => item.product?.name).join(', ')}
                        {order.items?.length > 2 && '...'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-lg font-bold text-green-600">₹{order.total}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      <StatusIcon className="mr-1" />
                      {getStatusDisplayName(order.status)}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <BiCalendar className="mr-2 text-gray-400" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(order._id, 'confirmed')}
                            className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
                          >
                            <BiCheck className="mr-1" />
                            Confirm
                          </button>
                          <button
                            onClick={() => updateStatus(order._id, 'cancelled')}
                            className="inline-flex items-center px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                          >
                            <BiX className="mr-1" />
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(order._id, 'shipped')}
                          className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                          <BiTruck className="mr-1" />
                          Ship Order
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateStatus(order._id, 'delivered')}
                          className="inline-flex items-center px-3 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors duration-200"
                        >
                          <BiCheckCircle className="mr-1" />
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                <BiShoppingBag className="mr-3 text-blue-600" />
                Orders Management
              </h2>
              <p className="text-gray-600 mt-1">
                Track and manage customer orders efficiently
              </p>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <BiRefresh className="mr-2" />
              Refresh Orders
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3 lg:gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs lg:text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-yellow-50 rounded-xl shadow-lg border border-yellow-200 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-yellow-800">{stats.pending}</div>
            <div className="text-xs lg:text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-blue-50 rounded-xl shadow-lg border border-blue-200 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-blue-800">{stats.confirmed}</div>
            <div className="text-xs lg:text-sm text-blue-600">Confirmed</div>
          </div>
          <div className="bg-purple-50 rounded-xl shadow-lg border border-purple-200 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-purple-800">{stats.shipped}</div>
            <div className="text-xs lg:text-sm text-purple-600">Shipped</div>
          </div>
          <div className="bg-green-50 rounded-xl shadow-lg border border-green-200 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-green-800">{stats.delivered}</div>
            <div className="text-xs lg:text-sm text-green-600">Delivered</div>
          </div>
          <div className="bg-red-50 rounded-xl shadow-lg border border-red-200 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-red-800">{stats.cancelled}</div>
            <div className="text-xs lg:text-sm text-red-600">Cancelled</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-3 lg:p-4 text-center col-span-2 sm:col-span-1">
            <div className="text-lg lg:text-lg font-bold text-green-800 flex items-center justify-center">
              {/* <BiDollar className="mr-1" /> */}
              ₹{stats.totalRevenue}
            </div>
            <div className="text-xs lg:text-sm text-green-600">Revenue</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <BiFilter className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="total-desc">Highest Value</option>
                  <option value="total-asc">Lowest Value</option>
                  <option value="status-asc">Status A-Z</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'table' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BiListUl className="text-lg" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BiGrid className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <BiShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Orders will appear here when customers make purchases'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            {viewMode === 'table' ? renderTableView() : renderGridView()}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;