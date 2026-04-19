import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

// CartItemDTO shape from backend:
// { id, variantId, productId, productTitle, primaryImageUrl, size, color, stockQuantity, price, quantity, subtotal }

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 py-4">
      <Link to={`/products/${item.productId}`} className="shrink-0">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-orange/10 to-orange/5 flex items-center justify-center">
          {item.primaryImageUrl ? (
            <img src={item.primaryImageUrl} alt={item.productTitle} className="w-full h-full object-cover" />
          ) : (
            <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
          )}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.productId}`}>
          <h3 className="font-medium hover:text-orange transition-colors line-clamp-2">{item.productTitle}</h3>
        </Link>
        <div className="flex flex-wrap gap-3 mt-2">
          {item.color && <span className="text-xs text-muted-foreground">Color: {item.color}</span>}
          {item.size && <span className="text-xs text-muted-foreground">Size: {item.size}</span>}
        </div>
        {/* Mobile controls */}
        <div className="flex items-center justify-between mt-3 md:hidden">
          <span className="font-bold text-orange">{formatPrice((item.price || 0) * item.quantity)}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onRemove(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Desktop controls */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center border rounded-lg">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center">{item.quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="hidden md:flex flex-col items-end gap-2">
        <span className="font-bold text-orange text-lg">{formatPrice((item.price || 0) * item.quantity)}</span>
        <span className="text-sm text-muted-foreground">{formatPrice(item.price || 0)} each</span>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onRemove(item.id)}>
          <Trash2 className="h-4 w-4 mr-1" />Remove
        </Button>
      </div>
    </div>
  )
}

export default function Cart() {
  const navigate = useNavigate()
  const { cartItems, cartTotal, updateQty, removeItem, isLoading } = useCart()

  // Use backend-computed total if available, otherwise compute locally
  const subtotal = cartTotal > 0 ? cartTotal : cartItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-12 pb-8">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything yet.</p>
              <Button asChild className="bg-orange hover:bg-orange/90 text-orange-foreground">
                <Link to="/products">Browse Products</Link>
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
          <div className="lg:col-span-2">
            <Card className="border-orange/10">
              <CardContent className="p-0 divide-y">
                {cartItems.map(item => (
                  <div key={item.id} className="px-4">
                    <CartItem item={item} onUpdateQuantity={updateQty} onRemove={removeItem} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="sticky top-24 border-orange/10">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
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
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-orange">{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button onClick={() => navigate('/checkout')} className="w-full bg-orange hover:bg-orange/90 text-orange-foreground" size="lg">
                  Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" asChild className="w-full border-orange text-orange hover:bg-orange/10">
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
