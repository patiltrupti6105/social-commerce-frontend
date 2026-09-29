import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPrice } from '@/lib/utils'
import { adminApi } from '@/api/adminApi'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShoppingCart, DollarSign, Package } from 'lucide-react'

export default function Analytics() {
  const [overview, setOverview] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [ordersByDay, setOrdersByDay] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.getAnalytics(),
      adminApi.getTopProducts(),
      adminApi.getOrdersByDay(),
    ]).then(([ovRes, tpRes, obdRes]) => {
      setOverview(ovRes.data.data)
      setTopProducts(tpRes.data.data || [])
      setOrdersByDay(obdRes.data.data || [])
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Spinner className="h-8 w-8" /></div>

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Analytics Overview</h2>

      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: overview.totalUsers, icon: Users, color: 'text-purple' },
            { label: 'Total Orders', value: overview.totalOrders, icon: ShoppingCart, color: 'text-blue' },
            { label: 'Total Revenue', value: formatPrice(overview.totalRevenue), icon: DollarSign, color: 'text-green' },
            { label: 'Total Products', value: overview.totalProducts, icon: Package, color: 'text-orange' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold">{value ?? '—'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {ordersByDay.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Orders by Day</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--blue))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {topProducts.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.productId || i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-sm text-muted-foreground font-medium">#{i + 1}</span>
                    <p className="text-sm font-medium">{p.title}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{p.orderCount} orders</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
