import { useState, useEffect } from 'react'
import { orderApi } from '@/api/orderApi'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent } from '@/components/ui/card'

const STATUS_COLORS = {
  PLACED: 'bg-blue/10 text-blue',
  SHIPPED: 'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green/10 text-green',
  CANCELLED: 'bg-red-100 text-red-600',
}

export default function SellerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  const fetchOrders = (p = 0) => {
    setLoading(true)
    orderApi.getSellerOrders(0)
      .then(r => setOrders(r.data.data?.content || r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders(page) }, [page])

  const handleShip = async (id) => {
    await orderApi.shipOrder(id)
    fetchOrders(page)
  }

  const handleDeliver = async (id) => {
    await orderApi.deliverOrder(id)
    fetchOrders(page)
  }

  if (loading) return <div className="flex justify-center py-8"><Spinner className="h-6 w-6" /></div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Incoming Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No orders yet</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">Order #{order.uuid || order.id}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    {order.buyer && <p className="text-sm text-muted-foreground">From: {order.buyer.name}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={STATUS_COLORS[order.status] || 'bg-muted text-muted-foreground'}>{order.status}</Badge>
                    <span className="font-semibold text-orange">{formatPrice(order.totalAmount || order.total)}</span>
                  </div>
                </div>

                {(order.items || []).length > 0 && (
                  <div className="space-y-1 mb-3">
                    {order.items.map(item => (
                      <p key={item.id} className="text-sm text-muted-foreground">
                        {item.productTitle} × {item.quantity} — {formatPrice(item.priceAtPurchase * item.quantity)}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {order.status === 'PLACED' && (
                    <Button size="sm" onClick={() => handleShip(order.id)} className="bg-blue hover:bg-blue/90 text-blue-foreground">
                      Mark Shipped
                    </Button>
                  )}
                  {order.status === 'SHIPPED' && (
                    <Button size="sm" onClick={() => handleDeliver(order.id)} className="bg-green hover:bg-green/90 text-green-foreground">
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
