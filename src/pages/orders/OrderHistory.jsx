import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

// Demo orders
const DEMO_ORDERS = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'DELIVERED',
    total: 249.98,
    items: [
      { id: '1', title: 'Premium Wireless Headphones', quantity: 1, price: 199.99 },
      { id: '3', title: 'Wireless Ergonomic Mouse', quantity: 1, price: 49.99 },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-18',
    status: 'SHIPPED',
    total: 149.99,
    items: [
      { id: '2', title: 'Mechanical Gaming Keyboard', quantity: 1, price: 149.99 },
    ],
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-20',
    status: 'PLACED',
    total: 89.98,
    items: [
      { id: '4', title: 'USB-C Hub 7-in-1', quantity: 2, price: 39.99 },
    ],
  },
  {
    id: 'ORD-2024-004',
    date: '2024-01-10',
    status: 'CANCELLED',
    total: 79.99,
    items: [
      { id: '5', title: 'Summer Floral Dress', quantity: 1, price: 79.99 },
    ],
  },
]

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

function OrderCard({ order }) {
  return (
    <Link to={`/orders/${order.id}`}>
      <Card className="border-orange/10 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-mono text-sm text-muted-foreground">{order.id}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDate(order.date)}</p>
            </div>
            <Badge className={statusColors[order.status]}>
              {statusLabels[order.status]}
            </Badge>
          </div>

          {/* Items Preview */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {order.items.slice(0, 3).map((item, i) => (
                <div
                  key={item.id}
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange/10 to-orange/5 border-2 border-background flex items-center justify-center"
                  style={{ zIndex: 3 - i }}
                >
                  <ShoppingBag className="h-4 w-4 text-muted-foreground/30" />
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-12 h-12 rounded-lg bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">
                {order.items[0].title}
                {order.items.length > 1 && ` and ${order.items.length - 1} more`}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-orange">{formatPrice(order.total)}</span>
            <Button variant="ghost" size="sm" className="text-orange">
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredOrders = DEMO_ORDERS.filter(order => {
    if (activeTab === 'active') return ['PLACED', 'SHIPPED'].includes(order.status)
    if (activeTab === 'completed') return order.status === 'DELIVERED'
    if (activeTab === 'cancelled') return order.status === 'CANCELLED'
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6">
            <TabsTrigger 
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:bg-transparent"
            >
              All Orders
            </TabsTrigger>
            <TabsTrigger 
              value="active"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:bg-transparent"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:bg-transparent"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:bg-transparent"
            >
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <Card className="border-orange/10">
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-semibold mb-2">No orders found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {activeTab === 'all' 
                      ? "You haven't placed any orders yet."
                      : `No ${activeTab} orders.`}
                  </p>
                  <Button asChild className="bg-orange hover:bg-orange/90 text-orange-foreground">
                    <Link to="/products">Start Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
