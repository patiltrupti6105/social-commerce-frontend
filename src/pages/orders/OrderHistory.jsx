import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { orderApi } from '@/api/orderApi'

const STATUS_COLORS = {
  PLACED: 'bg-blue/10 text-blue',
  SHIPPED: 'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green/10 text-green',
  CANCELLED: 'bg-red-100 text-red-600',
  RETURN_REQUESTED: 'bg-orange/10 text-orange',
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    orderApi.getOrders(page)
      .then(r => {
        setOrders(r.data.data?.content || [])
        setTotalPages(r.data.data?.totalPages || 0)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [page])

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Button asChild><Link to="/products">Start Shopping</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`}>
                <Card className="hover:border-blue/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">Order #{order.uuid || order.id}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={STATUS_COLORS[order.status] || 'bg-muted text-muted-foreground'}>{order.status}</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {(order.items || []).slice(0, 3).map((item, i) => (
                          <div key={i} className="w-10 h-10 rounded-lg bg-muted border-2 border-background flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}</p>
                        <p className="text-sm text-blue font-semibold">{formatPrice(order.totalAmount || order.total)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  )
}
