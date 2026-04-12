import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Check, 
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Demo product data
const DEMO_PRODUCT = {
  id: '1',
  title: 'Premium Wireless Headphones - Active Noise Cancelling, 40hr Battery Life, Hi-Fi Sound',
  description: 'Experience exceptional sound quality with our premium wireless headphones. Featuring advanced active noise cancellation technology, these headphones deliver crystal-clear audio whether you\'re commuting, working, or relaxing. The ergonomic design ensures comfort during extended listening sessions, while the long-lasting battery keeps the music playing for up to 40 hours.',
  price: 199.99,
  originalPrice: 249.99,
  avgRating: 4.5,
  reviewCount: 234,
  seller: { id: '2', name: 'TechGear Pro', rating: 4.8 },
  images: [null, null, null, null],
  variants: {
    colors: [
      { id: 'black', name: 'Midnight Black', hex: '#1a1a1a' },
      { id: 'white', name: 'Pearl White', hex: '#f5f5f5' },
      { id: 'blue', name: 'Ocean Blue', hex: '#3b82f6' },
    ],
    sizes: [
      { id: 'standard', name: 'Standard', inStock: true },
      { id: 'pro', name: 'Pro (with case)', inStock: true, priceAdd: 30 },
    ],
  },
  stock: 15,
  features: [
    'Active Noise Cancellation',
    '40-hour battery life',
    'Hi-Fi audio drivers',
    'Bluetooth 5.2',
    'Multipoint connection',
    'Foldable design',
  ],
  reviews: [
    { id: '1', author: 'John D.', rating: 5, title: 'Best headphones I\'ve owned!', text: 'The sound quality is incredible and the noise cancellation is top-notch. Highly recommend!', date: '2024-01-15', verified: true },
    { id: '2', author: 'Sarah M.', rating: 4, title: 'Great but a bit tight', text: 'Sound is amazing, but they feel a bit tight after a few hours. Otherwise excellent!', date: '2024-01-10', verified: true },
    { id: '3', author: 'Mike R.', rating: 5, title: 'Worth every penny', text: 'Finally found headphones that live up to the hype. Battery life is exactly as advertised.', date: '2024-01-05', verified: false },
  ],
  ratingBreakdown: { 5: 156, 4: 52, 3: 18, 2: 5, 1: 3 },
}

function RatingStars({ rating, size = 'default' }) {
  const starSize = size === 'small' ? 'h-3 w-3' : 'h-5 w-5'
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            starSize,
            star <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product] = useState(DEMO_PRODUCT)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.variants.colors[0].id)
  const [selectedSize, setSelectedSize] = useState(product.variants.sizes[0].id)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const selectedSizeData = product.variants.sizes.find(s => s.id === selectedSize)
  const finalPrice = product.price + (selectedSizeData?.priceAdd || 0)
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsAddingToCart(false)
    // In real app, dispatch to cart store
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="truncate">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue/10 to-blue/5 flex items-center justify-center">
              {product.images[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-2xl bg-blue/20 flex items-center justify-center mb-4">
                    <span className="text-blue text-5xl font-bold">SS</span>
                  </div>
                  <span className="text-muted-foreground">Product Image</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                    selectedImage === i ? "border-blue" : "border-transparent"
                  )}
                >
                  <div className="w-full h-full bg-gradient-to-br from-blue/10 to-blue/5 flex items-center justify-center">
                    <span className="text-blue text-xs font-bold">SS</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Title & Rating */}
            <h1 className="text-2xl font-bold mb-3">{product.title}</h1>
            
            <div className="flex items-center gap-3 mb-4">
              <RatingStars rating={product.avgRating} />
              <span className="text-sm text-muted-foreground">
                {product.avgRating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Seller */}
            <Link to={`/profile/${product.seller.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue mb-4">
              Sold by <span className="text-foreground font-medium">{product.seller.name}</span>
              <RatingStars rating={product.seller.rating} size="small" />
            </Link>

            <Separator className="my-4" />

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-blue">{formatPrice(finalPrice)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice + (selectedSizeData?.priceAdd || 0))}
                  </span>
                  <Badge className="bg-orange text-orange-foreground">-{discount}%</Badge>
                </>
              )}
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">
                Color: <span className="text-muted-foreground">{product.variants.colors.find(c => c.id === selectedColor)?.name}</span>
              </Label>
              <div className="flex gap-2">
                {product.variants.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all",
                      selectedColor === color.id ? "border-blue ring-2 ring-blue/20" : "border-transparent"
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Size</Label>
              <div className="flex gap-2">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    disabled={!size.inStock}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                      selectedSize === size.id 
                        ? "border-blue bg-blue/10 text-blue" 
                        : "border-border hover:border-blue/50",
                      !size.inStock && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {size.name}
                    {size.priceAdd && <span className="text-muted-foreground ml-1">(+${size.priceAdd})</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Quantity</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.stock < 20 && (
                  <span className="text-sm text-orange">Only {product.stock} left in stock</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 bg-blue hover:bg-blue/90 text-blue-foreground"
              >
                {isAddingToCart ? <Spinner className="mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="flex-1 border-blue text-blue hover:bg-blue/10"
              >
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
              <div className="text-center">
                <Truck className="h-5 w-5 mx-auto mb-1 text-blue" />
                <span className="text-xs">Free Shipping</span>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 mx-auto mb-1 text-blue" />
                <span className="text-xs">Secure Payment</span>
              </div>
              <div className="text-center">
                <RotateCcw className="h-5 w-5 mx-auto mb-1 text-blue" />
                <span className="text-xs">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold mb-2">{product.avgRating}</div>
                <RatingStars rating={product.avgRating} />
                <p className="text-sm text-muted-foreground mt-2">Based on {product.reviewCount} reviews</p>
                
                {/* Rating Breakdown */}
                <div className="mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = product.ratingBreakdown[rating] || 0
                    const percentage = (count / product.reviewCount) * 100
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-8">{rating}★</span>
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground w-10">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Review List */}
              <div className="md:col-span-2 space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.author}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <RatingStars rating={review.rating} size="small" />
                            <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium mb-1">{review.title}</h4>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Label({ children, className }) {
  return <label className={cn("text-sm font-medium", className)}>{children}</label>
}
