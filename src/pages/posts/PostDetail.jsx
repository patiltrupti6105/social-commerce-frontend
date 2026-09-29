import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Heart, MessageCircle, Send, ImageOff, ShoppingBag, ShoppingCart } from 'lucide-react'
import { formatRelativeTime, formatPrice } from '@/lib/utils'
import { socialApi } from '@/api/socialApi'

export default function PostDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    Promise.all([socialApi.getPost(id), socialApi.getComments(id)])
      .then(([postRes, commentsRes]) => {
        setPost(postRes.data.data)
        setComments(commentsRes.data.data || [])
      })
      .catch(() => toast.error('Could not load post'))
      .finally(() => setIsLoading(false))
  }, [id])

  const handleLike = async () => {
    const userId = String(user?.id)
    // Optimistic
    setPost(prev => {
      const liked = prev.likedByUserIds?.includes(userId)
      return {
        ...prev,
        likesCount: (prev.likesCount || 0) + (liked ? -1 : 1),
        likedByUserIds: liked
          ? prev.likedByUserIds.filter(i => i !== userId)
          : [...(prev.likedByUserIds || []), userId],
      }
    })
    try {
      const res = await socialApi.likePost(id)
      const updated = res.data.data
      setPost(prev => ({ ...prev, likesCount: updated.likesCount, likedByUserIds: updated.likedByUserIds }))
    } catch {
      // Revert optimistic update
      setPost(prev => {
        const liked = prev.likedByUserIds?.includes(userId)
        return {
          ...prev,
          likesCount: (prev.likesCount || 0) + (liked ? -1 : 1),
          likedByUserIds: liked
            ? prev.likedByUserIds.filter(i => i !== userId)
            : [...(prev.likedByUserIds || []), userId],
        }
      })
      toast.error('Could not update like')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setIsSubmitting(true)
    try {
      const res = await socialApi.addComment(id, commentText)
      setComments(prev => [...prev, res.data.data])
      setCommentText('')
      setPost(prev => prev ? { ...prev, commentsCount: (prev.commentsCount || 0) + 1 } : prev)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  )
  if (!post) return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Post not found
    </div>
  )

  const isLiked = post.likedByUserIds?.includes(String(user?.id))
  const hasMedia = post.mediaUrls?.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />Back
        </Button>

        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Media panel */}
            <div className="aspect-square bg-muted relative">
              {hasMedia && !imgError ? (
                <img src={post.mediaUrls[0]} alt="Post" className="w-full h-full object-cover"
                  onError={() => setImgError(true)} />
              ) : hasMedia && imgError ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted">
                  <ImageOff className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">Image unavailable</p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green/10 to-green/5 p-6">
                  <p className="text-sm text-center text-muted-foreground leading-relaxed">{post.content}</p>
                </div>
              )}
            </div>

            {/* Detail panel */}
            <div className="flex flex-col h-full min-h-[400px]">
              {/* Author header */}
              <div className="flex items-center gap-3 p-4 border-b">
                <Link to={`/profile/${post.authorId}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.authorAvatarUrl} />
                    <AvatarFallback className="bg-green text-green-foreground text-sm font-semibold">
                      {(post.authorName || post.authorId)?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <Link to={`/profile/${post.authorId}`} className="font-semibold hover:underline text-sm">
                    {post.authorName || `User ${post.authorId?.slice(0, 8)}`}
                  </Link>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
                </div>
              </div>

              {/* Caption + comments scrollable area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
                {hasMedia && post.content && (
                  <>
                    <p className="text-sm">
                      <Link to={`/profile/${post.authorId}`} className="font-semibold hover:underline mr-1">
                        {post.authorName || post.authorId?.slice(0, 8)}
                      </Link>
                      {post.content}
                    </p>
                    <Separator />
                  </>
                )}
                {comments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first!</p>
                )}
                {comments.map(c => (
                  <div key={c.id} className="flex items-start gap-2">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage src={c.authorAvatarUrl} />
                      <AvatarFallback className="text-xs">
                        {(c.authorName || c.authorId)?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-semibold mr-2">
                        {c.authorName || c.authorId?.slice(0, 8)}
                      </span>
                      <span className="text-sm">{c.text || c.content}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(c.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Linked product card */}
              {post.linkedProductId && (
                <div className="border-t px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Tagged product</p>
                  <Link to={`/products/${post.linkedProductId}`}
                    className="flex items-center gap-3 p-2 rounded-lg border hover:border-blue/40 hover:bg-blue/5 transition-colors group">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      {post.linkedProductImageUrl
                        ? <img src={post.linkedProductImageUrl} alt={post.linkedProductTitle}
                            className="w-full h-full object-cover" />
                        : <ShoppingBag className="h-5 w-5 m-3.5 text-muted-foreground/40" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1 group-hover:text-blue transition-colors">
                        {post.linkedProductTitle || 'View Product'}
                      </p>
                      {post.linkedProductPrice != null && (
                        <p className="text-sm font-bold text-blue">{formatPrice(post.linkedProductPrice)}</p>
                      )}
                    </div>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-blue transition-colors shrink-0" />
                  </Link>
                </div>
              )}

              {/* Actions */}
              <div className="border-t p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <button onClick={handleLike}
                    className={`transition-transform active:scale-125 ${isLiked ? 'text-red-500' : 'hover:text-muted-foreground'}`}
                    aria-label={isLiked ? 'Unlike' : 'Like'}>
                    <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold">{(post.likesCount || 0).toLocaleString()} likes</p>
                <form onSubmit={handleComment} className="flex items-center gap-2 pt-1">
                  <Input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..." className="flex-1 text-sm" autoComplete="off" />
                  <Button type="submit" size="sm" variant="ghost" className="text-green hover:text-green/80"
                    disabled={!commentText.trim() || isSubmitting}>
                    {isSubmitting ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
