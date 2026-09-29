import { useState, useEffect } from 'react'
import { orderApi } from '@/api/orderApi'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Package } from 'lucide-react'

// Backend GET /seller/orders returns List<OrderItemDTO>:
// { id, orderId, productId, variantId, productTitle, variantDetails,
//   quantity, priceAtPurchase, subtotal, sellerId }
// Order-level status/ship/deliver are on the Order, not the OrderItem.
// The ship/deliver endpoints take orderId.

const STATUS_COLORS = {
  PLACED:    'bg-blue/10 text-blue',
  SHIPPED:   'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green/10 text-green',
  CANCELLED: 'bg-red-100 text-red-600',
}

export default function SellerOrders() {
  const [items, setItems]     = useState([])   // List<OrderItemDTO>
  const [loading, setLoading] = useState(true)
  const [acting, setActing]   = useState(null) // orderId being acted on

  const fetchOrders = () => {
    setLoading(true)
    orderApi.getSellerOrders()
      .then(r => {
        // Backend returns ApiResponse<List<OrderItemDTO>> — no pagination
        const data = r.data.data
        setItems(Array.isArray(data) ? data : data?.content ?? [])
      })
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const handleShip = async (orderId) => {
    setActing(orderId)
    try {
      await orderApi.shipOrder(orderId)
      toast.success('Order marked as shipped')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not update order')
    } finally {
      setActing(null)
    }
  }

  const handleDeliver = async (orderId) => {
    setActing(orderId)
    try {
      await orderApi.deliverOrder(orderId)
      toast.success('Order marked as delivered')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not update order')
    } finally {
      setActing(null)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-12"><Spinner className="h-6 w-6" /></div>
  )

  // Group order items by orderId so we show one card per order
  const grouped = items.reduce((acc, item) => {
    const key = item.orderId
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const orderIds = Object.keys(grouped)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Incoming Orders
        {orderIds.length > 0 && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({orderIds.length} order{orderIds.length !== 1 ? 's' : ''})
          </span>
        )}
      </h2>

      {orderIds.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orderIds.map(orderId => {
            const orderItems = grouped[orderId]
            const total = orderItems.reduce((s, i) => s + (i.subtotal || i.priceAtPurchase * i.quantity || 0), 0)

            return (
              <Card key={orderId}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-sm">Order #{orderId}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {orderItems.length} item{orderItems.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <span className="font-semibold text-orange">{formatPrice(total)}</span>
                  </div>

                  <div className="space-y-1 mb-4">
                    {orderItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground line-clamp-1 flex-1">
                          {item.productTitle}
                          {item.variantDetails ? ` — ${item.variantDetails}` : ''}
                          {' '}× {item.quantity}
                        </span>
                        <span className="font-medium ml-4 shrink-0">
                          {formatPrice(item.subtotal ?? item.priceAtPurchase * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" disabled={acting === Number(orderId)}
                      className="bg-blue hover:bg-blue/90 text-blue-foreground"
                      onClick={() => handleShip(Number(orderId))}>
                      {acting === Number(orderId) ? <Spinner className="h-4 w-4 mr-1" /> : null}
                      Mark Shipped
                    </Button>
                    <Button size="sm" disabled={acting === Number(orderId)}
                      className="bg-green hover:bg-green/90 text-green-foreground"
                      onClick={() => handleDeliver(Number(orderId))}>
                      Mark Delivered
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
