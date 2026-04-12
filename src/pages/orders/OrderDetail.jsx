import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  MapPin, 
  ShoppingBag,
  Star,
  XCircle
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Demo order data
const DEMO_ORDER = {
  id: 'ORD-2024-002',
  date: '2024-01-18',
  status: 'SHIPPED',
  total: 593.95,
  subtotal: 549.96,
  shipping: 0,
  tax: 43.99,
  items: [
    { id: '1', title: 'Premium Wireless Headphones', variant: 'Black / Standard', price: 199.99, quantity: 1, canReview: false },
    { id: '2', title: 'Mechanical Gaming Keyboard', variant: 'RGB / Full Size', price: 149.99, quantity: 2, canReview: false },
    { id: '3', title: 'Wireless Ergonomic Mouse', variant: 'Space Gray', price: 49.99, quantity: 1, canReview: false },
  ],
  shippingAddress: {
    fullName: 'Alex Johnson',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    pincode: '10001',
  },
  timeline: [
    { status: 'PLACED', date: '2024-01-18 10:30 AM', completed: true },
    { status: 'SHIPPED', date: '2024-01-19 02:15 PM', completed: true },
    { status: 'DELIVERED', date: null, completed: false },
  ],
}

const statusColors = {
  PLACED: 'bg-blue text-blue-foreground',
  SHIPPED: 'bg-orange text-orange-foreground',
  DELIVERED: 'bg-green text-green-foreground',
  CANCELLED: 'bg-destructive text-destructive-foreground',
}

const statusLabels = {
  PLACED: 'Order Placed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

const stepIcons = {
  PLACED: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
}

function OrderTimeline({ timeline, currentStatus }) {
  return (
    <div className="relative">
      {timeline.map((step, index) => {
        const Icon = stepIcons[step.status] || Package
        const isLast = index === timeline.length - 1
        
        return (
          <div key={step.status} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                step.completed 
                  ? "bg-green text-green-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              {!isLast && (
                <div className={cn(
                  "w-0.5 h-16",
                  step.completed ? "bg-green" : "bg-muted"
                )} />
              )}
            </div>

            {/* Content */}
            <div className="pb-8">
              <h4 className={cn(
                "font-medium",
                !step.completed && "text-muted-foreground"
              )}>
                {statusLabels[step.status]}
              </h4>
              <p className="text-sm text-muted-foreground">
                {step.date || 'Pending'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order] = useState(DEMO_ORDER)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const canCancel = order.status === 'PLACED'
  const canReview = order.status === 'DELIVERED'

  const handleCancelOrder = async () => {
    setIsCancelling(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    // In real app, call API to cancel order
    setIsCancelling(false)
    setCancelDialogOpen(false)
    navigate('/orders')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{order.id}</h1>
              <p className="text-sm text-muted-foreground">Placed on {formatDate(order.date)}</p>
            </div>
          </div>
          <Badge className={statusColors[order.status]}>
            {statusLabels[order.status]}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="border-orange/10">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange/10 to-orange/5 flex items-center justify-center shrink-0">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.id}`}>
                        <h3 className="font-medium hover:text-orange transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">
                          {formatPrice(item.price)} x {item.quantity}
                        </span>
                        <span className="font-medium text-orange">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                      {canReview && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 text-orange border-orange/20 hover:bg-orange/10"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Write Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-orange/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                <p className="text-sm mt-2">
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status Timeline */}
            <Card className="border-orange/10">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-orange/10">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-orange">{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Cancel Order */}
            {canCancel && (
              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Order?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel this order? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                      Keep Order
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleCancelOrder}
                      disabled={isCancelling}
                    >
                      {isCancelling ? <Spinner className="mr-2" /> : null}
                      Yes, Cancel Order
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
