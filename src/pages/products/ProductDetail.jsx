import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
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
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      const promises = [productApi.getProductById(id), productApi.getReviews(id)]
      if (isAuthenticated) promises.push(socialApi.getWishlist())
      const results = await Promise.allSettled(promises)

      if (results[0].status === 'fulfilled') {
        const p = results[0].value.data.data
        setProduct(p)
        setSelectedVariant(p.variants?.[0] || null)
      } else {
        toast.error('Could not load product')
      }
      if (results[1].status === 'fulfilled') {
        setReviews(results[1].value.data.data?.content || [])
      }
      if (isAuthenticated && results[2]?.status === 'fulfilled') {
        const wishlist = results[2].value.data.data || []
        setIsWishlisted(wishlist.some(item => String(item.productId || item.id) === String(id)))
      }
      setIsLoading(false)
    }
    fetchAll()
  }, [id, isAuthenticated])

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!selectedVariant) { toast.error('Please select a variant first'); return }
    setIsAddingToCart(true)
    try {
      await addItem(selectedVariant.id, quantity)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setIsWishlistLoading(true)
    try {
      if (isWishlisted) {
        await socialApi.removeFromWishlist(id)
        setIsWishlisted(false)
        toast.success('Removed from wishlist')
      } else {
        await socialApi.addToWishlist(id)
        setIsWishlisted(true)
        toast.success('Saved to wishlist ♡')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not update wishlist')
    } finally {
      setIsWishlistLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    )
  }
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Product not found
      </div>
    )
  }

  // Backend ProductDetailDTO returns imageUrls: string[] (flat list)
  const images = product.imageUrls?.length > 0 ? product.imageUrls : [null]
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
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImageIndex(i)}
                    className={cn('w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors',
                      selectedImageIndex === i ? 'border-blue' : 'border-transparent hover:border-blue/40')}>
                    {img ? <img src={img} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-muted" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            {product.sellerId && (
              <Link to={`/profile/${product.sellerId}`} className="text-sm text-muted-foreground hover:text-foreground">
                {product.sellerName || `Seller #${product.sellerId}`}
              </Link>
            )}
            <h1 className="text-2xl font-bold leading-tight">{product.title}</h1>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={cn('h-4 w-4',
                    s <= Math.round(product.avgRating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/30')} />
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

            {product.variants?.length > 0 && (
              <div className="space-y-3">
                {[...new Set(product.variants.map(v => v.color).filter(Boolean))].length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Color</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(product.variants.map(v => v.color).filter(Boolean))].map(color => (
                        <button key={color}
                          onClick={() => setSelectedVariant(
                            product.variants.find(v => v.color === color && (!selectedVariant?.size || v.size === selectedVariant?.size))
                            || product.variants.find(v => v.color === color))}
                          className={cn('px-3 py-1.5 rounded-lg border text-sm transition-colors',
                            selectedVariant?.color === color
                              ? 'border-blue bg-blue/10 text-blue'
                              : 'border-border hover:border-blue/50')}>
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {[...new Set(product.variants.map(v => v.size).filter(Boolean))].length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(product.variants.map(v => v.size).filter(Boolean))].map(size => (
                        <button key={size}
                          onClick={() => setSelectedVariant(
                            product.variants.find(v => v.size === size && (!selectedVariant?.color || v.color === selectedVariant?.color))
                            || product.variants.find(v => v.size === size))}
                          className={cn('px-3 py-1.5 rounded-lg border text-sm transition-colors',
                            selectedVariant?.size === size
                              ? 'border-blue bg-blue/10 text-blue'
                              : 'border-border hover:border-blue/50')}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium">Qty</p>
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" className="h-9 w-9"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-9 w-9"
                  onClick={() => setQuantity(q => Math.min(q + 1, selectedVariant?.stockQuantity || 99))}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {selectedVariant?.stockQuantity > 0 && (
                <span className="text-xs text-muted-foreground">{selectedVariant.stockQuantity} in stock</span>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddToCart} disabled={isAddingToCart || isOutOfStock}
                className="flex-1 bg-blue hover:bg-blue/90 text-blue-foreground" size="lg">
                {isAddingToCart ? <Spinner className="mr-2 h-4 w-4" /> : <ShoppingCart className="h-5 w-5 mr-2" />}
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg" onClick={handleWishlist} disabled={isWishlistLoading}
                className={cn(isWishlisted ? 'text-red-500 border-red-500 hover:bg-red-50' : '')}>
                {isWishlistLoading
                  ? <Spinner className="h-5 w-5" />
                  : <Heart className={cn('h-5 w-5', isWishlisted ? 'fill-current' : '')} />}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: Shield, label: 'Secure Payment' },
                { icon: RotateCcw, label: 'Easy Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50 text-center">
                  <Icon className="h-5 w-5 text-blue" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            {product.description && (
              <div>
                <Separator className="mb-4" />
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
