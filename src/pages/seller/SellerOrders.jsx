import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { formatPrice, formatDate } from '../../lib/utils';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/seller/orders');
      setOrders(response.data.orders);
    } catch (error) {
      // Mock data for demo
      setOrders([
        {
          id: 1,
          orderNumber: 'ORD-2024-001',
          customer: { name: 'John Doe', email: 'john@example.com', address: '123 Main St, City, State 12345' },
          items: [
            { id: 1, name: 'Premium Headphones', quantity: 1, price: 129.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
          ],
          total: 129.99,
          status: 'pending',
          paymentStatus: 'paid',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          orderNumber: 'ORD-2024-002',
          customer: { name: 'Jane Smith', email: 'jane@example.com', address: '456 Oak Ave, Town, State 67890' },
          items: [
            { id: 2, name: 'Wireless Keyboard', quantity: 2, price: 89.99, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=100' },
          ],
          total: 179.98,
          status: 'processing',
          paymentStatus: 'paid',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 3,
          orderNumber: 'ORD-2024-003',
          customer: { name: 'Bob Wilson', email: 'bob@example.com', address: '789 Pine Rd, Village, State 11111' },
          items: [
            { id: 3, name: 'Gaming Mouse', quantity: 1, price: 49.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100' },
            { id: 4, name: 'Mouse Pad XL', quantity: 1, price: 19.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100' },
          ],
          total: 69.98,
          status: 'shipped',
          paymentStatus: 'paid',
          trackingNumber: 'TRK123456789',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 4,
          orderNumber: 'ORD-2024-004',
          customer: { name: 'Alice Brown', email: 'alice@example.com', address: '321 Elm St, Metro, State 22222' },
          items: [
            { id: 5, name: 'USB-C Hub', quantity: 1, price: 39.99, image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=100' },
          ],
          total: 39.99,
          status: 'delivered',
          paymentStatus: 'paid',
          trackingNumber: 'TRK987654321',
          createdAt: new Date(Date.now() - 432000000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/seller/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      // For demo, update locally
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    }
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize whitespace-nowrap ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {status}
            {status !== 'all' && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-background/20">
                {orders.filter(o => o.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Order Header */}
              <div className="p-4 sm:p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="px-4 py-2 text-sm border border-input rounded-lg hover:bg-muted transition-colors"
                    >
                      {selectedOrder === order.id ? 'Close' : 'Update Status'}
                    </button>
                  </div>
                </div>

                {/* Status Update Panel */}
                {selectedOrder === order.id && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-3">Update Order Status</p>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status)}
                          disabled={order.status === status}
                          className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${
                            order.status === status
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border border-input hover:bg-muted'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-foreground">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Customer Info & Total */}
                <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">{order.customer.address}</p>
                    {order.trackingNumber && (
                      <p className="text-sm text-primary mt-2">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-foreground">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
