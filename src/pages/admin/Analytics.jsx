import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice } from '../../lib/utils';

// Generate mock data for last 30 days
const generateOrdersData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      orders: Math.floor(Math.random() * 50) + 10,
    });
  }
  return data;
};

const topProducts = [
  { rank: 1, name: 'Premium Wireless Headphones', orders: 342, revenue: 44258.58 },
  { rank: 2, name: 'Mechanical Gaming Keyboard', orders: 289, revenue: 25999.11 },
  { rank: 3, name: 'Ergonomic Office Chair', orders: 234, revenue: 52650.00 },
  { rank: 4, name: 'USB-C Hub Adapter', orders: 198, revenue: 7912.02 },
  { rank: 5, name: '4K Webcam Pro', orders: 176, revenue: 14048.24 },
  { rank: 6, name: 'Smart Watch Series X', orders: 165, revenue: 49335.00 },
  { rank: 7, name: 'Portable Bluetooth Speaker', orders: 154, revenue: 9240.00 },
  { rank: 8, name: 'Laptop Stand Aluminum', orders: 143, revenue: 8576.57 },
  { rank: 9, name: 'Noise Cancelling Earbuds', orders: 132, revenue: 17148.00 },
  { rank: 10, name: 'LED Desk Lamp', orders: 121, revenue: 4839.79 },
];

export default function Analytics() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalRevenue: 234567.89,
        totalOrders: 1847,
        totalUsers: 5623,
        totalProducts: 892,
      });
      setOrdersData(generateOrdersData());
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform performance overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-6">Orders per Day (Last 30 Days)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval={4}
                className="fill-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar
                dataKey="orders"
                fill="#9333ea"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Top 10 Products by Order Count</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Rank</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Orders</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topProducts.map((product) => (
                <tr key={product.rank} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      product.rank <= 3 ? 'bg-purple-100 text-purple-600' : 'bg-muted text-muted-foreground'
                    }`}>
                      {product.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-foreground">{product.orders.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-foreground font-medium">{formatPrice(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
