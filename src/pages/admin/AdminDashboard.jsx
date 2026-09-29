import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '@/api/adminApi'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Users, Package, ShoppingCart, DollarSign, Clock, AlertTriangle } from 'lucide-react'

export default function AdminDashboard() {
  const [overview, setOverview]       = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [ordersByDay, setOrdersByDay] = useState([])
  const [pending, setPending]         = useState([])
  const [isLoading, setIsLoading]     = useState(true)

  useEffect(() => {
    Promise.allSettled([
      adminApi.getAnalytics(),
      adminApi.getTopProducts(),
      adminApi.getOrdersByDay(),
      adminApi.getPendingProducts(),
    ]).then(([overviewRes, topRes, dayRes, pendingRes]) => {
      if (overviewRes.status === 'fulfilled') setOverview(overviewRes.value.data.data)
      if (topRes.status === 'fulfilled')     setTopProducts(topRes.value.data.data || [])
      if (dayRes.status === 'fulfilled')     setOrdersByDay(dayRes.value.data.data || [])
      if (pendingRes.status === 'fulfilled') setPending(pendingRes.value.data.data || [])
    }).finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner className="h-10 w-10" />
    </div>
  )

  const stats = [
    { label: 'Total Users',      value: overview?.totalUsers      ?? '—', icon: Users,        color: 'text-blue' },
    { label: 'Total Products',   value: overview?.totalProducts   ?? '—', icon: Package,      color: 'text-purple' },
    { label: 'Total Orders',     value: overview?.totalOrders     ?? '—', icon: ShoppingCart,  color: 'text-orange' },
    { label: 'Total Revenue',    value: overview?.totalRevenue != null ? formatPrice(overview.totalRevenue) : '—', icon: DollarSign, color: 'text-green' },
    { label: 'Pending Review',   value: pending.length,                   icon: Clock,        color: 'text-yellow-600' },
    { label: 'Reported Posts',   value: overview?.reportedPosts   ?? '—', icon: AlertTriangle, color: 'text-red-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-muted ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Top Products by Rating</CardTitle>
            <Link to="/admin/products" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topProducts.slice(0, 5).map((p, i) => (
                  <div key={p.id || i} className="flex items-center justify-between py-1 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                      <span className="text-sm font-medium line-clamp-1">{p.title}</span>
                    </div>
                    <span className="text-sm text-yellow-600 font-semibold shrink-0 ml-2">★ {p.avgRating?.toFixed(1) ?? '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders by day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Orders by Day</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersByDay.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No data yet</p>
            ) : (
              <div className="space-y-2">
                {ordersByDay.slice(0, 7).map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{d.date || d.day}</span>
                    <span className="font-semibold">{d.count ?? d.orders} orders</span>
                    <span className="text-green font-semibold">{d.revenue != null ? formatPrice(d.revenue) : ''}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <Card>
        <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {[
              { to: '/admin/users',    label: 'Manage Users' },
              { to: '/admin/products', label: 'Review Pending Products' },
              { to: '/admin/posts',    label: 'Moderated Posts' },
              { to: '/admin/analytics',label: 'Full Analytics' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="px-4 py-2 rounded-lg border hover:bg-accent text-sm transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
