import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { formatPrice, formatDate } from '../../lib/utils';

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        api.get('/seller/stats'),
        api.get('/seller/orders?limit=5'),
        api.get('/seller/products?limit=5&sort=sales'),
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.orders || []);
      setTopProducts(productsRes.data.products || []);
    } catch (error) {
      // Use mock data for demo
      setStats({
        totalProducts: 24,
        totalOrders: 156,
        totalRevenue: 12450.00,
        pendingOrders: 8,
      });
      setRecentOrders([
        { id: 1, orderNumber: 'ORD-001', customer: 'John Doe', total: 125.00, status: 'pending', createdAt: new Date().toISOString() },
        { id: 2, orderNumber: 'ORD-002', customer: 'Jane Smith', total: 89.99, status: 'shipped', createdAt: new Date().toISOString() },
        { id: 3, orderNumber: 'ORD-003', customer: 'Bob Wilson', total: 249.00, status: 'delivered', createdAt: new Date().toISOString() },
      ]);
      setTopProducts([
        { id: 1, name: 'Premium Headphones', sales: 45, revenue: 4500, stock: 12 },
        { id: 2, name: 'Wireless Keyboard', sales: 38, revenue: 2850, stock: 25 },
        { id: 3, name: 'Gaming Mouse', sales: 32, revenue: 1600, stock: 8 },
      ]);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your products and orders</p>
        </div>
        <Link
          to="/seller/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Products</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold text-foreground">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
            <Link to="/seller/orders" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{formatPrice(order.total)}</p>
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Top Products</h2>
            <Link to="/seller/products" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {topProducts.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground">No products yet</p>
            ) : (
              topProducts.map((product) => (
                <div key={product.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{formatPrice(product.revenue)}</p>
                      <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Link
          to="/seller/products"
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors"
        >
          <div className="p-3 bg-muted rounded-lg">
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-foreground">Manage Products</p>
            <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
          </div>
        </Link>

        <Link
          to="/seller/orders"
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors"
        >
          <div className="p-3 bg-muted rounded-lg">
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-foreground">View Orders</p>
            <p className="text-sm text-muted-foreground">Process and track orders</p>
          </div>
        </Link>

        <Link
          to="/seller/analytics"
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors"
        >
          <div className="p-3 bg-muted rounded-lg">
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-foreground">Analytics</p>
            <p className="text-sm text-muted-foreground">View sales and performance</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
