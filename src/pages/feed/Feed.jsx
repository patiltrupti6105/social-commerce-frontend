import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Send, Plus } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { socialApi } from '@/api/socialApi'

// Post document shape from backend:
// { id, authorId, content, likesCount, likedByUserIds[], commentsCount, createdAt, isReported }
// Note: no author object, no mediaUrls, no caption — use content, authorId

function PostCard({ post, currentUserId, onLike }) {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  const isLiked = post.likedByUserIds?.includes(String(currentUserId))
  const images = post.mediaUrls || []

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setIsSubmitting(true)
    try {
      await socialApi.addComment(post.id, commentText)
      setCommentText('')
      setShowCommentInput(false)
    } catch (_) {} finally { setIsSubmitting(false) }
  }

  return (
    <Card className="border-green/10 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link to={`/profile/${post.authorId}`}>
          <Avatar className="h-10 w-10 border border-green/20">
            <AvatarFallback className="bg-green text-green-foreground">
              {post.authorId?.charAt(0)?.toUpperCase() || 'U'}
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

      {/* Show post images if available, otherwise show placeholder */}
      {images.length > 0 ? (
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img src={images[imgIndex]} alt="Post" className="w-full h-full object-cover" />
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIndex(i => Math.max(0, i - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-20 text-lg"
                disabled={imgIndex === 0}>‹</button>
              <button onClick={() => setImgIndex(i => Math.min(images.length - 1, i + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-20 text-lg"
                disabled={imgIndex === images.length - 1}>›</button>
              <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                {imgIndex + 1}/{images.length}
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="relative aspect-square bg-gradient-to-br from-green/10 to-green/5 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-green/20 flex items-center justify-center mb-2">
              <span className="text-green text-3xl font-bold">SS</span>
            </div>
          </div>
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={() => onLike(post.id)}
              className={`transition-colors ${isLiked ? 'text-red-500' : 'hover:text-muted-foreground'}`}>
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={() => setShowCommentInput(!showCommentInput)} className="hover:text-muted-foreground transition-colors">
              <MessageCircle className="h-6 w-6" />
            </button>
            <button className="hover:text-muted-foreground transition-colors"><Share2 className="h-6 w-6" /></button>
          </div>
        </div>
        <p className="font-semibold mb-2">{(post.likesCount || 0).toLocaleString()} likes</p>
        {/* Backend uses 'content' not 'caption' */}
        <p className="text-sm">
          <Link to={`/profile/${post.authorId}`} className="font-semibold hover:underline mr-2">
            {post.authorName || post.authorId?.slice(0, 8)}
          </Link>
          {post.content}
        </p>
        {post.commentsCount > 0 && (
          <Link to={`/posts/${post.id}`} className="text-sm text-muted-foreground hover:text-foreground mt-2 block">
            View all {post.commentsCount} comments
          </Link>
        )}

        {/* Tagged products */}
        {post.taggedProductIds && post.taggedProductIds.length > 0 && (
          <div className="mt-3 pt-3 border-t border-green/10">
            <p className="text-xs text-muted-foreground mb-2">🏷️ Tagged products</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {post.taggedProductIds.map(pid => (
                <Link key={pid} to={`/products/${pid}`}
                  className="flex-shrink-0 border border-green/20 rounded-lg px-3 py-1.5 text-xs hover:border-green hover:bg-green/5 transition-colors">
                  View Product
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {showCommentInput && (
        <CardFooter className="p-4 pt-0 border-t">
          <form onSubmit={handleComment} className="flex items-center gap-2 w-full">
            <Input value={commentText} onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..." className="flex-1 border-0 focus-visible:ring-0 px-0" />
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

export default function Feed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const observerRef = useRef()

  const loadFeed = useCallback(async (p) => {
    if (p > 0) setIsFetchingMore(true)
    else setIsLoading(true)
    try {
      const res = await socialApi.getFeed(p)
      // Backend returns Page<Post>: { content[], totalPages, last, ... }
      const pageData = res.data.data
      const newPosts = pageData?.content || []
      setPosts(prev => p > 0 ? [...prev, ...newPosts] : newPosts)
      setHasMore(!pageData?.last && newPosts.length > 0)
    } catch (_) {
      setHasMore(false)
    } finally {
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }, [])

  useEffect(() => { loadFeed(0) }, [loadFeed])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          const nextPage = page + 1
          setPage(nextPage)
          loadFeed(nextPage)
        }
      },
      { threshold: 0.1 }
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore, isFetchingMore, page, loadFeed])

  const handleLike = async (postId) => {
    // PUT /posts/{id}/like — returns updated Post object
    try {
      const res = await socialApi.likePost(postId)
      const updatedPost = res.data.data
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: updatedPost.likesCount, likedByUserIds: updatedPost.likedByUserIds } : p))
    } catch (_) {
      // Optimistic fallback
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p
        const userId = String(user?.id)
        const liked = p.likedByUserIds?.includes(userId)
        return {
          ...p,
          likesCount: (p.likesCount || 0) + (liked ? -1 : 1),
          likedByUserIds: liked ? p.likedByUserIds.filter(id => id !== userId) : [...(p.likedByUserIds || []), userId]
        }
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[600px] mx-auto px-4 py-6">
        <Card className="mb-6 p-4 border-green/20">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-green/20">
              <AvatarFallback className="bg-green text-green-foreground">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
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

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner className="h-8 w-8 text-green" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No posts yet. Follow some users to see their posts!</div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} currentUserId={user?.id} onLike={handleLike} />
            ))}
          </div>
        )}

        <div ref={observerRef} className="flex justify-center py-8">
          {isFetchingMore && <Spinner className="h-6 w-6 text-green" />}
          {!hasMore && posts.length > 0 && <p className="text-sm text-muted-foreground">You&apos;ve seen all posts</p>}
        </div>
      </div>
    </div>
  )
}