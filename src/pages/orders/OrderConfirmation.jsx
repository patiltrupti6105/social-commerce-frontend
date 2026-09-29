import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { CheckCircle, ShoppingBag, Package, ArrowRight } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { orderApi } from '@/api/orderApi'

export default function OrderConfirmation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    orderApi.getOrderById(id)
      .then(r => setOrder(r.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  )

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Order not found
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">

        {/* Success banner */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-20 w-20 rounded-full bg-green/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green" />
          </div>
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground mt-2">
            Your order <span className="font-medium text-foreground">#{order.uuid || order.id}</span> was placed on {formatDate(order.createdAt)}.
          </p>
          <div className="mt-3 px-4 py-2 rounded-full bg-green/10 text-green text-sm font-medium">
            Payment: {order.paymentStatus?.replace('_', ' ') || 'Confirmed'}
          </div>
        </div>

        <div className="space-y-5">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" />Items Ordered
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {(order.items || []).map(item => (
                <div key={item.id} className="flex items-center gap-4 py-3">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.productTitle}</p>
                    {item.variantDetails && <p className="text-xs text-muted-foreground">{item.variantDetails}</p>}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(item.priceAtPurchase * item.quantity)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery To</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-0.5">
                <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              </CardContent>
            </Card>
          )}

          {/* Total */}
          <Card>
            <CardContent className="pt-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green">FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Paid</span>
                <span className="text-green">{formatPrice(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild className="flex-1 bg-blue hover:bg-blue/90">
              <Link to={`/orders/${id}`}>
                Track Order <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}