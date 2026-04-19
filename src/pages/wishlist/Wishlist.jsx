import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { socialApi } from '@/api/socialApi'
import { useCart } from '@/context/CartContext'

export default function Wishlist() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    socialApi.getWishlist()
      .then(r => setItems(r.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const handleRemove = async (productId) => {
    setRemovingId(productId)
    try {
      await socialApi.removeFromWishlist(productId)
      setItems(prev => prev.filter(i => (i.productId || i.id) !== productId))
    } catch (_) {}
    finally { setRemovingId(null) }
  }

  const handleAddToCart = async (item) => {
    const variantId = item.variants?.[0]?.id
    if (!variantId) { navigate(`/products/${item.productId || item.id}`); return }
    setAddingId(item.productId || item.id)
    try {
      await addItem(variantId, 1)
    } catch (_) {}
    finally { setAddingId(null) }
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-red-500 fill-current" />
          <h1 className="text-2xl font-bold">Wishlist</h1>
          <span className="text-sm text-muted-foreground">({items.length} items)</span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Heart className="h-16 w-16 text-muted-foreground/20" />
            <p className="text-lg font-medium">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground">Save products you love and come back to them later.</p>
            <Button onClick={() => navigate('/products')} className="mt-2">Browse Products</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => {
              const pid = item.productId || item.id
              const price = item.priceOverride || item.price || 0
              const image = item.primaryImageUrl || item.imageUrl || null
              const inStock = item.inStock !== false && (item.stockQuantity == null || item.stockQuantity > 0)

              return (
                <Card key={pid} className="overflow-hidden group hover:shadow-md transition-shadow">
                  <Link to={`/products/${pid}`} className="block">
                    <div className="aspect-square bg-muted overflow-hidden">
                      {image ? (
                        <img src={image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue/10 to-blue/5">
                          <ShoppingCart className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Link to={`/products/${pid}`} className="font-medium text-sm line-clamp-2 hover:underline">
                        {item.title}
                      </Link>
                      {item.sellerName && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.sellerName}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue">{formatPrice(price)}</span>
                      {!inStock && (
                        <span className="text-xs text-red-500 font-medium">Out of stock</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className={cn('flex-1', inStock ? 'bg-blue hover:bg-blue/90' : 'opacity-50 cursor-not-allowed')}
                        disabled={!inStock || addingId === pid}
                        onClick={() => handleAddToCart(item)}
                      >
                        {addingId === pid
                          ? <Spinner className="h-4 w-4" />
                          : <><ShoppingCart className="h-4 w-4 mr-1.5" />Add to Cart</>}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={removingId === pid}
                        onClick={() => handleRemove(pid)}
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-400"
                      >
                        {removingId === pid ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}