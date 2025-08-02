import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const res = await axiosInstance.patch(`/api/orders/${id}/status`, { status });
      setOrders(orders.map(order =>
        order._id === id ? { ...order, status: res.data.status } : order
      ));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'dispatched': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Orders Management</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No orders found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Items</th>
                  <th className="text-left py-3 px-4 font-semibold">Total</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-mono text-sm">{order._id.slice(-8)}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{order.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">₹{order.total}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(order._id, 'accepted')}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateStatus(order._id, 'cancelled')}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {order.status === 'accepted' && (
                          <button
                            onClick={() => updateStatus(order._id, 'dispatched')}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                          >
                            Dispatch
                          </button>
                        )}
                        {order.status === 'dispatched' && (
                          <button
                            onClick={() => updateStatus(order._id, 'delivered')}
                            className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;