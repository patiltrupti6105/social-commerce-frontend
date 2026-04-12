import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function ProductCard({
  id,
  title,
  price,
  avgRating = 0,
  reviewCount = 0,
  primaryImageUrl,
  sellerName,
  onAddToCart,
}) {
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(id)
    }
  }

  return (
    <Link to={`/products/${id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-blue/30">
        {/* Image */}
        <div className="aspect-square relative overflow-hidden bg-muted">
          {primaryImageUrl ? (
            <img
              src={primaryImageUrl}
              alt={title}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
          
          {/* Quick Add to Cart */}
          <Button
            size="sm"
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-blue hover:bg-blue/90 text-blue-foreground"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        <CardContent className="p-4">
          {/* Seller */}
          {sellerName && (
            <p className="text-xs text-muted-foreground mb-1">{sellerName}</p>
          )}

          {/* Title */}
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-blue transition-colors">
            {title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= Math.round(avgRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-blue">
            {formatPrice(price)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
