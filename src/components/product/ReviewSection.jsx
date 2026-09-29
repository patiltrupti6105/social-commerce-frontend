import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Star } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { productApi } from '@/api/productApi'
import { useAuth } from '@/context/AuthContext'

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
        >
          <Star className={cn('h-6 w-6 transition-colors',
            s <= (hovered || value) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
          )} />
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback>{(review.author || review.buyerName || 'U').charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-medium text-sm">{review.author || review.buyerName || 'Anonymous'}</span>
              {review.isVerifiedPurchase && (
                <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
              )}
            </div>
            <div className="flex mb-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={cn('h-3.5 w-3.5', s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30')} />
              ))}
            </div>
            {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
            <p className="text-sm text-muted-foreground leading-relaxed">{review.body || review.text}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatDate(review.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReviewSection({ productId, reviews: initialReviews = [], avgRating = 0, reviewCount = 0 }) {
  const { isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Star breakdown
  const counts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }))
  const total = reviews.length || reviewCount

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { setError('Please select a rating'); return }
    if (!body.trim()) { setError('Please write a review'); return }
    setIsSubmitting(true)
    setError('')
    try {
      const res = await productApi.submitReview(productId, { rating, title, body })
      setReviews(prev => [res.data.data, ...prev])
      setShowForm(false)
      setRating(0)
      setTitle('')
      setBody('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. You may need to purchase this product first.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Customer Reviews</h2>
        {isAuthenticated && !showForm && (
          <Button variant="outline" onClick={() => setShowForm(true)}>Write a Review</Button>
        )}
      </div>

      {/* Summary bar */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-xl bg-muted/50">
          <div className="flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-5xl font-bold">{Number(avgRating).toFixed(1)}</span>
            <div className="flex mt-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={cn('h-4 w-4', s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30')} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground mt-1">{total} reviews</span>
          </div>
          <div className="flex-1 space-y-1.5">
            {counts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-muted-foreground text-right">{star}</span>
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="w-5 text-muted-foreground text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review form */}
      {showForm && (
        <Card className="border-blue/20">
          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-semibold">Your Review</h3>
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="space-y-1.5">
                <Label>Rating</Label>
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="review-title">Title (optional)</Label>
                <Input id="review-title" placeholder="Summarise your experience" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="review-body">Review</Label>
                <Textarea id="review-body" placeholder="What did you like or dislike?" rows={4} value={body} onChange={e => setBody(e.target.value)} required />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting} className="bg-blue hover:bg-blue/90">
                  {isSubmitting ? <><Spinner className="mr-2" />Submitting...</> : 'Submit Review'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setError('') }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {success && (
        <Alert>
          <AlertDescription>Your review was submitted successfully!</AlertDescription>
        </Alert>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}
    </div>
  )
}