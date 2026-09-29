import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Plus, ImageOff, ShoppingBag, ShoppingCart } from 'lucide-react'
import { formatRelativeTime, formatPrice } from '@/lib/utils'
import { socialApi } from '@/api/socialApi'

// ── Skeleton card shown while loading ────────────────────────────────────────
function PostSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardHeader>
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </CardContent>
    </Card>
  )
}

// ── Individual post card ──────────────────────────────────────────────────────
function PostCard({ post, currentUserId, onLike }) {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imgError, setImgError] = useState(false)

  const isLiked = post.likedByUserIds?.includes(String(currentUserId))
  const hasMedia = post.mediaUrls?.length > 0

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setIsSubmitting(true)
    try {
      await socialApi.addComment(post.id, commentText)
      setCommentText('')
      setShowCommentInput(false)
      toast.success('Comment added')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link to={`/profile/${post.authorId}`}>
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
            <AvatarFallback className="bg-green text-green-foreground text-sm font-semibold">
              {(post.authorName || post.authorId)?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link to={`/profile/${post.authorId}`} className="font-semibold hover:underline text-sm">
            {post.authorName || `User ${post.authorId?.slice(0, 8)}`}
          </Link>
          <p className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>

      {/* Media or text-only placeholder */}
      <div className="relative aspect-square bg-muted">
        {hasMedia && !imgError ? (
          <img
            src={post.mediaUrls[0]}
            alt="Post media"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-green/10 to-green/5">
            {imgError && <ImageOff className="h-6 w-6 text-muted-foreground/40" />}
            <p className="text-sm text-center text-muted-foreground line-clamp-6 leading-relaxed">
              {post.content}
            </p>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Linked product card — shown when seller tagged a product */}
        {post.linkedProductId && (
          <Link to={`/products/${post.linkedProductId}`}
            className="flex items-center gap-3 p-3 mb-3 rounded-lg border border-blue/20 bg-blue/5 hover:border-blue/50 transition-colors group">
            <div className="w-11 h-11 rounded-lg overflow-hidden bg-muted shrink-0">
              {post.linkedProductImageUrl
                ? <img src={post.linkedProductImageUrl} alt={post.linkedProductTitle}
                    className="w-full h-full object-cover" />
                : <ShoppingBag className="h-5 w-5 m-3 text-muted-foreground/40" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Tagged product</p>
              <p className="text-sm font-medium line-clamp-1 group-hover:text-blue transition-colors">
                {post.linkedProductTitle || 'View Product'}
              </p>
              {post.linkedProductPrice != null && (
                <p className="text-xs font-bold text-blue">{formatPrice(post.linkedProductPrice)}</p>
              )}
            </div>
            <ShoppingCart className="h-4 w-4 text-blue/60 shrink-0" />
          </Link>
        )}

        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => onLike(post.id)}
            className={`transition-transform active:scale-125 ${isLiked ? 'text-red-500' : 'hover:text-muted-foreground'}`}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="hover:text-muted-foreground transition-colors"
            aria-label="Comment"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
          <button onClick={handleShare} className="hover:text-muted-foreground transition-colors" aria-label="Share">
            <Share2 className="h-6 w-6" />
          </button>
        </div>

        <p className="font-semibold text-sm mb-1">{(post.likesCount || 0).toLocaleString()} likes</p>

        {hasMedia && post.content && (
          <p className="text-sm">
            <Link to={`/profile/${post.authorId}`} className="font-semibold hover:underline mr-1">
              {post.authorName || post.authorId?.slice(0, 8)}
            </Link>
            {post.content}
          </p>
        )}

        {post.commentsCount > 0 && (
          <Link to={`/posts/${post.id}`} className="text-xs text-muted-foreground hover:text-foreground mt-2 block">
            View all {post.commentsCount} comments
          </Link>
        )}
      </CardContent>

      {showCommentInput && (
        <CardFooter className="p-4 pt-0 border-t">
          <form onSubmit={handleComment} className="flex items-center gap-2 w-full">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border-0 focus-visible:ring-0 px-0"
              autoFocus
            />
            <Button type="submit" size="sm" variant="ghost" className="text-green hover:text-green/80"
              disabled={!commentText.trim() || isSubmitting}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  )
}

// ── Feed page ─────────────────────────────────────────────────────────────────
export default function Feed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const observerRef = useRef()
  // Refs so the IntersectionObserver closure always sees current values
  // without needing to be recreated on every state change.
  const isFetchingRef = useRef(false)
  const hasMoreRef = useRef(true)
  const pageRef = useRef(0)
  const isLoadingRef = useRef(true)

  const loadFeed = useCallback(async (p) => {
    if (p > 0) {
      setIsFetchingMore(true)
      isFetchingRef.current = true
    } else {
      setIsLoading(true)
      isLoadingRef.current = true
    }
    try {
      const res = await socialApi.getFeed(p)
      const pageData = res.data.data
      const newPosts = pageData?.content || []
      setPosts(prev => p > 0 ? [...prev, ...newPosts] : newPosts)
      const more = !pageData?.last && newPosts.length > 0
      setHasMore(more)
      hasMoreRef.current = more
    } catch (err) {
      if (p === 0) toast.error('Could not load your feed. Please try again.')
      setHasMore(false)
      hasMoreRef.current = false
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
      setIsFetchingMore(false)
      isFetchingRef.current = false
    }
  }, [])

  useEffect(() => { loadFeed(0) }, [loadFeed])

  // Infinite scroll observer — uses refs so the callback is stable
  // and never fires during the initial page-0 load.
  useEffect(() => {
    const el = observerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasMoreRef.current &&
          !isFetchingRef.current &&
          !isLoadingRef.current   // ← never fire while page 0 is still in flight
        ) {
          const next = pageRef.current + 1
          pageRef.current = next
          setPage(next)
          loadFeed(next)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadFeed]) // stable — only created once

  const handleLike = async (postId) => {
    // Optimistic update first
    const userId = String(user?.id)
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const liked = p.likedByUserIds?.includes(userId)
      return {
        ...p,
        likesCount: (p.likesCount || 0) + (liked ? -1 : 1),
        likedByUserIds: liked
          ? (p.likedByUserIds || []).filter(id => id !== userId)
          : [...(p.likedByUserIds || []), userId],
      }
    }))
    try {
      const res = await socialApi.likePost(postId)
      const updated = res.data.data
      // Reconcile with server truth
      setPosts(prev => prev.map(p => p.id === postId
        ? { ...p, likesCount: updated.likesCount, likedByUserIds: updated.likedByUserIds }
        : p))
    } catch {
      // Revert optimistic update on error
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p
        const liked = p.likedByUserIds?.includes(userId)
        return {
          ...p,
          likesCount: (p.likesCount || 0) + (liked ? -1 : 1),
          likedByUserIds: liked
            ? (p.likedByUserIds || []).filter(id => id !== userId)
            : [...(p.likedByUserIds || []), userId],
        }
      }))
      toast.error('Could not update like')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[600px] mx-auto px-4 py-6">
        {/* Create post prompt */}
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={user?.avatarUrl || user?.avatar} />
              <AvatarFallback className="bg-green text-green-foreground">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <Link to="/posts/create" className="flex-1">
              <div className="bg-muted/50 rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                Share what you&apos;re shopping for...
              </div>
            </Link>
            <Link to="/posts/create">
              <Button size="icon" className="bg-green hover:bg-green/90 text-green-foreground rounded-full">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No posts yet</p>
            <p className="text-sm mt-1">Follow some users to see their posts here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} currentUserId={user?.id} onLike={handleLike} />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={observerRef} className="flex justify-center py-8">
          {isFetchingMore && (
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          )}
          {!hasMore && posts.length > 0 && (
            <p className="text-sm text-muted-foreground">You&apos;ve seen all posts</p>
          )}
        </div>
      </div>
    </div>
  )
}
