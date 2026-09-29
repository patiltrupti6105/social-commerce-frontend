import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderApi } from '@/api/orderApi'
import { productApi } from '@/api/productApi'
import { formatPrice, formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Package, ShoppingCart, DollarSign, Clock, Plus } from 'lucide-react'

const STATUS_COLORS = {
  PLACED: 'bg-blue/10 text-blue', SHIPPED: 'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green/10 text-green', CANCELLED: 'bg-red-100 text-red-600',
}

export default function SellerDashboard() {
  const [recentOrders, setRecentOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      orderApi.getSellerOrders(0),
      productApi.getSellerProducts(),
    ]).then(([ordersRes, productsRes]) => {
      setRecentOrders((ordersRes.data.data?.content || ordersRes.data.data || []).slice(0, 5))
      setProducts(productsRes.data.data || [])
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>

  const activeProducts = products.filter(p => p.status === 'ACTIVE').length
  const pendingOrders = recentOrders.filter(o => o.status === 'PLACED').length
  const totalRevenue = recentOrders.reduce((s, o) => s + (o.totalAmount || 0), 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <Link to="/seller/products/create">
            <Button className="bg-blue hover:bg-blue/90 text-blue-foreground">
              <Plus className="h-4 w-4 mr-2" />New Product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Products', value: activeProducts, icon: Package, color: 'text-blue' },
            { label: 'Total Products', value: products.length, icon: Package, color: 'text-purple' },
            { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-orange' },
            { label: 'Recent Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'text-green' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${color}`}><Icon className="h-5 w-5" /></div>
                <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-bold">{value}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link to="/seller/orders"><Button variant="ghost" size="sm">View all</Button></Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground text-sm">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map(o => (
                    <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">#{o.uuid || o.id}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={STATUS_COLORS[o.status] || 'bg-muted text-muted-foreground'}>{o.status}</Badge>
                        <span className="text-sm font-semibold text-orange">{formatPrice(o.totalAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Products</CardTitle>
              <Link to="/seller/products"><Button variant="ghost" size="sm">View all</Button></Link>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground text-sm">No products yet</p>
              ) : (
                <div className="space-y-3">
                  {products.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                        {p.primaryImageUrl ? <img src={p.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                          : <Package className="h-5 w-5 m-2.5 text-muted-foreground/50" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                        <p className="text-xs text-blue font-semibold">{formatPrice(p.price)}</p>
                      </div>
                      <Badge className={
                        p.status === 'ACTIVE' ? 'bg-green/10 text-green' :
                        p.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                        p.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground'
                      }>{p.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
