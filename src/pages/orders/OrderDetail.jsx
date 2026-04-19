import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, ShoppingBag, XCircle } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { orderApi } from '@/api/orderApi'

const STATUS_COLORS = {
  PLACED: 'bg-blue/10 text-blue',
  SHIPPED: 'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green/10 text-green',
  CANCELLED: 'bg-red-100 text-red-600',
  RETURN_REQUESTED: 'bg-orange/10 text-orange',
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    orderApi.getOrderById(id)
      .then(r => setOrder(r.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [id])

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      const res = await orderApi.cancelOrder(id)
      setOrder(res.data.data)
    } catch (_) {} finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>
  if (!order) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Order not found</div>

  const canCancel = order.status === 'PLACED'

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.uuid || order.id}</h1>
            <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <Badge className={`ml-auto ${STATUS_COLORS[order.status] || 'bg-muted text-muted-foreground'}`}>{order.status}</Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Items</CardTitle></CardHeader>
            <CardContent className="divide-y">
              {(order.items || []).map(item => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{item.productTitle}</p>
                    {item.variantDetails && <p className="text-sm text-muted-foreground">{item.variantDetails}</p>}
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-blue">{formatPrice(item.priceAtPurchase * item.quantity)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {order.shippingAddress && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Delivery Address</CardTitle></CardHeader>
              <CardContent>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                <p className="text-sm mt-2">{order.shippingAddress.addressLine1}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.totalAmount)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-green">FREE</span></div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg"><span>Total</span><span className="text-blue">{formatPrice(order.totalAmount)}</span></div>
            </CardContent>
          </Card>

          {canCancel && (
            <Button variant="destructive" onClick={handleCancel} disabled={isCancelling} className="w-full">
              {isCancelling ? <><Spinner className="mr-2" />Cancelling...</> : <><XCircle className="h-4 w-4 mr-2" />Cancel Order</>}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
