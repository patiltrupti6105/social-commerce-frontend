import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Demo cart items
const DEMO_CART = [
  {
    id: '1',
    product: {
      id: '1',
      title: 'Premium Wireless Headphones',
      price: 199.99,
      imageUrl: null,
      seller: 'TechGear Pro',
    },
    variant: { size: 'Standard', color: 'Midnight Black' },
    quantity: 1,
  },
  {
    id: '2',
    product: {
      id: '2',
      title: 'Mechanical Gaming Keyboard',
      price: 149.99,
      imageUrl: null,
      seller: 'GameZone',
    },
    variant: { size: 'Full Size', color: 'RGB Black' },
    quantity: 2,
  },
  {
    id: '3',
    product: {
      id: '3',
      title: 'Wireless Ergonomic Mouse',
      price: 49.99,
      imageUrl: null,
      seller: 'TechGear Pro',
    },
    variant: { color: 'Space Gray' },
    quantity: 1,
  },
]

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 py-4">
      {/* Product Image */}
      <Link to={`/products/${item.product.id}`} className="shrink-0">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-orange/10 to-orange/5 flex items-center justify-center">
          {item.product.imageUrl ? (
            <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
          ) : (
            <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.product.id}`}>
          <h3 className="font-medium hover:text-orange transition-colors line-clamp-2">
            {item.product.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">{item.product.seller}</p>
        
        {/* Variant */}
        <div className="flex flex-wrap gap-2 mt-2">
          {item.variant.color && (
            <span className="text-xs text-muted-foreground">Color: {item.variant.color}</span>
          )}
          {item.variant.size && (
            <span className="text-xs text-muted-foreground">Size: {item.variant.size}</span>
          )}
        </div>

        {/* Mobile Price & Actions */}
        <div className="flex items-center justify-between mt-3 md:hidden">
          <span className="font-bold text-orange">{formatPrice(item.product.price * item.quantity)}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Quantity */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Desktop Price */}
      <div className="hidden md:flex flex-col items-end gap-2">
        <span className="font-bold text-orange text-lg">
          {formatPrice(item.product.price * item.quantity)}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatPrice(item.product.price)} each
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  )
}

export default function Cart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(DEMO_CART)

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-12 pb-8">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Button asChild className="bg-orange hover:bg-orange/90 text-orange-foreground">
                <Link to="/products">
                  Browse Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart ({cartItems.length} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="border-orange/10">
              <CardContent className="p-0 divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="px-4">
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24 border-orange/10">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green">FREE</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add {formatPrice(100 - subtotal)} more for free shipping!
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-orange">{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-orange hover:bg-orange/90 text-orange-foreground"
                  size="lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  className="w-full border-orange text-orange hover:bg-orange/10"
                >
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
