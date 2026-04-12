import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MoreHorizontal,
  Send,
  Plus
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

// Demo posts data
const DEMO_POSTS = [
  {
    id: '1',
    author: {
      id: '2',
      name: 'Sarah Chen',
      avatar: null,
      isVerified: true,
    },
    images: [null],
    caption: 'Just got these amazing headphones! The sound quality is incredible. Highly recommend for all music lovers out there. #tech #music #lifestyle',
    likes: 234,
    comments: [
      { id: '1', author: 'John', text: 'Looks great!' },
      { id: '2', author: 'Emma', text: 'I need these!' },
    ],
    taggedProducts: [
      { id: '1', name: 'Premium Headphones', price: 199.99 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    author: {
      id: '3',
      name: 'Mike Wilson',
      avatar: null,
      isVerified: false,
    },
    images: [null, null],
    caption: 'New setup complete! What do you think? Let me know in the comments below.',
    likes: 567,
    comments: [
      { id: '1', author: 'Alex', text: 'Clean setup!' },
      { id: '2', author: 'Sarah', text: 'Love the minimalist vibe' },
      { id: '3', author: 'Tom', text: 'What keyboard is that?' },
    ],
    taggedProducts: [
      { id: '2', name: 'Mechanical Keyboard', price: 149.99 },
      { id: '3', name: 'Wireless Mouse', price: 49.99 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isLiked: true,
    isSaved: false,
  },
  {
    id: '3',
    author: {
      id: '4',
      name: 'Emma Davis',
      avatar: null,
      isVerified: true,
    },
    images: [null],
    caption: 'Summer collection is here! Check out these beautiful dresses perfect for any occasion.',
    likes: 892,
    comments: [
      { id: '1', author: 'Lisa', text: 'Beautiful!' },
      { id: '2', author: 'Anna', text: 'Need the pink one!' },
    ],
    taggedProducts: [
      { id: '4', name: 'Summer Dress - Floral', price: 79.99 },
      { id: '5', name: 'Summer Dress - Solid', price: 69.99 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isLiked: false,
    isSaved: true,
  },
]

function PostCard({ post, onLike, onSave }) {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleLike = () => {
    onLike(post.id)
  }

  const handleSave = () => {
    onSave(post.id)
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      // In a real app, send comment to API
      setCommentText('')
      setShowCommentInput(false)
    }
  }

  return (
    <Card className="border-green/10 overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link to={`/profile/${post.author.id}`}>
          <Avatar className="h-10 w-10 border border-green/20">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback className="bg-green text-green-foreground">
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link to={`/profile/${post.author.id}`} className="font-semibold hover:underline flex items-center gap-1">
            {post.author.name}
            {post.author.isVerified && (
              <span className="text-green text-xs">✓</span>
            )}
          </Link>
          <p className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>

      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-green/10 to-green/5">
        {post.images[currentImageIndex] ? (
          <img 
            src={post.images[currentImageIndex]} 
            alt="Post" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-green/20 flex items-center justify-center mb-2">
                <span className="text-green text-4xl font-bold">SS</span>
              </div>
              <span className="text-muted-foreground text-sm">Image placeholder</span>
            </div>
          </div>
        )}
        
        {/* Image indicators */}
        {post.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            {post.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentImageIndex ? 'bg-green' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`transition-colors ${post.isLiked ? 'text-red-500' : 'hover:text-muted-foreground'}`}
            >
              <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => setShowCommentInput(!showCommentInput)}
              className="hover:text-muted-foreground transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <button className="hover:text-muted-foreground transition-colors">
              <Share2 className="h-6 w-6" />
            </button>
          </div>
          <button 
            onClick={handleSave}
            className={`transition-colors ${post.isSaved ? 'text-green' : 'hover:text-muted-foreground'}`}
          >
            <Bookmark className={`h-6 w-6 ${post.isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold mb-2">{post.likes.toLocaleString()} likes</p>

        {/* Caption */}
        <p className="text-sm">
          <Link to={`/profile/${post.author.id}`} className="font-semibold hover:underline mr-2">
            {post.author.name}
          </Link>
          {post.caption}
        </p>

        {/* Tagged Products */}
        {post.taggedProducts && post.taggedProducts.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.taggedProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Badge variant="secondary" className="bg-green/10 text-green hover:bg-green/20 cursor-pointer">
                  {product.name} - ${product.price}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Comments preview */}
        {post.comments.length > 0 && (
          <div className="mt-3">
            <Link 
              to={`/posts/${post.id}`} 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all {post.comments.length} comments
            </Link>
            <div className="mt-2 space-y-1">
              {post.comments.slice(0, 2).map((comment) => (
                <p key={comment.id} className="text-sm">
                  <span className="font-semibold mr-2">{comment.author}</span>
                  {comment.text}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Comment Input */}
      {showCommentInput && (
        <CardFooter className="p-4 pt-0 border-t">
          <form onSubmit={handleComment} className="flex items-center gap-2 w-full">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border-0 focus-visible:ring-0 px-0"
            />
            <Button 
              type="submit" 
              size="sm" 
              variant="ghost" 
              className="text-green hover:text-green/80"
              disabled={!commentText.trim()}
            >
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
  const [posts, setPosts] = useState(DEMO_POSTS)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef()

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        }
      }
      return post
    }))
  }

  const handleSave = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, isSaved: !post.isSaved }
      }
      return post
    }))
  }

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    // Simulate loading more posts
    setTimeout(() => {
      setPosts(prev => [
        ...prev,
        ...DEMO_POSTS.map((post, i) => ({
          ...post,
          id: `${post.id}-${prev.length + i}`,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (prev.length + i)).toISOString(),
        })),
      ])
      setIsLoading(false)
      if (posts.length >= 12) setHasMore(false)
    }, 1000)
  }, [isLoading, hasMore, posts.length])

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="min-h-screen bg-background">
      {/* Instagram-style centered feed */}
      <div className="max-w-[600px] mx-auto px-4 py-6">
        {/* Create Post CTA */}
        <Card className="mb-6 p-4 border-green/20">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-green/20">
              <AvatarImage src={user?.avatar} alt={user?.name} />
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
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onSave={handleSave}
            />
          ))}
        </div>

        {/* Loading indicator */}
        <div ref={observerRef} className="flex justify-center py-8">
          {isLoading && <Spinner className="h-6 w-6 text-green" />}
          {!hasMore && (
            <p className="text-sm text-muted-foreground">You&apos;ve seen all posts</p>
          )}
        </div>
      </div>
    </div>
  )
}
