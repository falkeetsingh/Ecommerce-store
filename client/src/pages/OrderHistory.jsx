import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../features/order/orderSlice';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="mb-6 p-4 bg-white rounded shadow">
            <div>Total: ₹{order.total}</div>
            <div>Date: {new Date(order.createdAt).toLocaleString()}</div>
            <div>
              Items:
              <ul>
                {order.items.map(item => (
                  <li key={item.product._id}>
                    {item.product.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;