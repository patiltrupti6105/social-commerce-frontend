import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Star, Heart, ShoppingCart, Minus, Plus, Check, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { productApi } from '@/api/productApi'
import { socialApi } from '@/api/socialApi'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import ReviewSection from '@/components/product/ReviewSection'
export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [cartMessage, setCartMessage] = useState('')

  useEffect(() => {
    Promise.all([productApi.getProductById(id), productApi.getReviews(id)])
      .then(([pRes, rRes]) => {
        const p = pRes.data.data
        setProduct(p)
        setSelectedVariant(p.variants?.[0] || null)
        setReviews(rRes.data.data?.content || [])
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!selectedVariant) return
    setIsAddingToCart(true)
    try {
      await addItem(selectedVariant.id, quantity)
      setCartMessage('Added to cart!')
      setTimeout(() => setCartMessage(''), 3000)
    } catch (err) {
      setCartMessage(err.response?.data?.message || 'Failed to add to cart')
      setTimeout(() => setCartMessage(''), 3000)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      if (isWishlisted) await socialApi.removeFromWishlist(id)
      else await socialApi.addToWishlist(id)
      setIsWishlisted(!isWishlisted)
    } catch (_) {}
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-10 w-10" /></div>
  if (!product) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Product not found</div>

  const images = product.images?.length > 0 ? product.images.map(i => i.imageUrl || i) : [null]
  const isOutOfStock = selectedVariant ? selectedVariant.stockQuantity <= 0 : false

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              {images[selectedImageIndex] ? (
                <img src={images[selectedImageIndex]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue/10 to-blue/5">
                  <span className="text-blue text-4xl font-bold">SS</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImageIndex(i)}
                    className={cn('w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors',
                      selectedImageIndex === i ? 'border-blue' : 'border-transparent')}>
                    {img ? <img src={img} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-muted" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            {product.seller && (
              <Link to={`/profile/${product.seller.id}`} className="text-sm text-muted-foreground hover:text-foreground">
                {product.seller.name || product.sellerName}
              </Link>
            )}
            <h1 className="text-2xl font-bold">{product.title}</h1>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={cn('h-4 w-4', s <= Math.round(product.avgRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30')} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewCount || 0} reviews)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-blue">
                {formatPrice(selectedVariant?.priceOverride || product.price)}
              </span>
              {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                {/* Group by color */}
                {[...new Set(product.variants.filter(v => v.color).map(v => v.color))].length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Color</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(product.variants.map(v => v.color).filter(Boolean))].map(color => (
                        <button key={color}
                          onClick={() => setSelectedVariant(product.variants.find(v => v.color === color && (!selectedVariant?.size || v.size === selectedVariant?.size)) || product.variants.find(v => v.color === color))}
                          className={cn('px-3 py-1.5 rounded-lg border text-sm transition-colors',
                            selectedVariant?.color === color ? 'border-blue bg-blue/10 text-blue' : 'border-border hover:border-blue/50')}>
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {[...new Set(product.variants.filter(v => v.size).map(v => v.size))].length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(product.variants.map(v => v.size).filter(Boolean))].map(size => (
                        <button key={size}
                          onClick={() => setSelectedVariant(product.variants.find(v => v.size === size && (!selectedVariant?.color || v.color === selectedVariant?.color)) || product.variants.find(v => v.size === size))}
                          className={cn('px-3 py-1.5 rounded-lg border text-sm transition-colors',
                            selectedVariant?.size === size ? 'border-blue bg-blue/10 text-blue' : 'border-border hover:border-blue/50')}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(q => q + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {cartMessage && (
              <Alert variant={cartMessage.includes('Failed') ? 'destructive' : 'default'}>
                <AlertDescription>{cartMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button onClick={handleAddToCart} disabled={isAddingToCart || isOutOfStock}
                className="flex-1 bg-blue hover:bg-blue/90 text-blue-foreground" size="lg">
                {isAddingToCart ? <Spinner className="mr-2" /> : <ShoppingCart className="h-5 w-5 mr-2" />}
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg" onClick={handleWishlist}
                className={isWishlisted ? 'text-red-500 border-red-500' : ''}>
                <Heart className={cn('h-5 w-5', isWishlisted ? 'fill-current' : '')} />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[{ icon: Truck, label: 'Free Shipping' }, { icon: Shield, label: 'Secure Payment' }, { icon: RotateCcw, label: 'Easy Returns' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50 text-center">
                  <Icon className="h-5 w-5 text-blue" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        <ReviewSection
          productId={id}
          reviews={reviews}
          avgRating={product.avgRating || 0}
          reviewCount={product.reviewCount || 0}
        />
      </div>
    </div>
  )
}
