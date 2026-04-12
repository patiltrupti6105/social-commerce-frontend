import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MoreHorizontal,
  Send,
  ShoppingBag
} from 'lucide-react'
import { formatRelativeTime, formatPrice } from '@/lib/utils'

// Demo post data
const DEMO_POST = {
  id: '1',
  author: {
    id: '2',
    name: 'Sarah Chen',
    avatar: null,
    isVerified: true,
  },
  images: [null],
  caption: 'Just got these amazing headphones! The sound quality is incredible. The bass is deep and the highs are crystal clear. Perfect for music production and casual listening. Highly recommend for all music lovers out there! #tech #music #lifestyle #audiophile',
  likes: 234,
  createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  isLiked: false,
  isSaved: false,
  taggedProducts: [
    { id: '1', name: 'Premium Headphones', price: 199.99, imageUrl: null },
    { id: '2', name: 'Headphone Stand', price: 29.99, imageUrl: null },
  ],
  comments: [
    { id: '1', author: { id: '3', name: 'John Doe', avatar: null }, text: 'Looks great! How is the battery life?', createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), likes: 12 },
    { id: '2', author: { id: '4', name: 'Emma Wilson', avatar: null }, text: 'I need these! Where did you get them?', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), likes: 8 },
    { id: '3', author: { id: '5', name: 'Mike Brown', avatar: null }, text: 'The sound quality is amazing on these. I have the same pair!', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), likes: 5 },
    { id: '4', author: { id: '6', name: 'Lisa Park', avatar: null }, text: 'Great choice! How do they compare to other brands?', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), likes: 3 },
  ],
}

export default function PostDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [post, setPost] = useState(DEMO_POST)
  const [commentText, setCommentText] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }))
  }

  const handleSave = () => {
    setPost(prev => ({ ...prev, isSaved: !prev.isSaved }))
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (commentText.trim() && user) {
      const newComment = {
        id: Date.now().toString(),
        author: { id: user.id, name: user.name, avatar: user.avatar },
        text: commentText,
        createdAt: new Date().toISOString(),
        likes: 0,
      }
      setPost(prev => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }))
      setCommentText('')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-16 z-40 bg-background border-b md:hidden">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Post</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="relative">
            {/* Back button - desktop */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="absolute -left-12 top-0 hidden md:flex"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-green/20 to-green/5">
              {post.images[currentImageIndex] ? (
                <img 
                  src={post.images[currentImageIndex]} 
                  alt="Post" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-2xl bg-green/20 flex items-center justify-center mb-4">
                      <span className="text-green text-5xl font-bold">SS</span>
                    </div>
                    <span className="text-muted-foreground">Image placeholder</span>
                  </div>
                </div>
              )}
            </div>

            {/* Image indicators */}
            {post.images.length > 1 && (
              <div className="flex justify-center gap-1 mt-4">
                {post.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentImageIndex ? 'bg-green' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Tagged Products */}
            {post.taggedProducts && post.taggedProducts.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <ShoppingBag className="h-4 w-4 text-green" />
                  Tagged Products
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {post.taggedProducts.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`}>
                      <Card className="w-[140px] shrink-0 overflow-hidden hover:shadow-md transition-shadow border-green/10">
                        <div className="aspect-square bg-gradient-to-br from-blue/10 to-blue/5 flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <CardContent className="p-2">
                          <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                          <p className="text-xs text-blue font-bold">{formatPrice(product.price)}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-col">
            {/* Author Header */}
            <div className="flex items-center gap-3 pb-4 border-b">
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
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Caption */}
            <div className="py-4 border-b">
              <p className="text-sm leading-relaxed">{post.caption}</p>
            </div>

            {/* Comments */}
            <ScrollArea className="flex-1 min-h-[200px] max-h-[300px]">
              <div className="py-4 space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Link to={`/profile/${comment.author.id}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <p className="text-sm">
                        <Link to={`/profile/${comment.author.id}`} className="font-semibold hover:underline mr-2">
                          {comment.author.name}
                        </Link>
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{formatRelativeTime(comment.createdAt)}</span>
                        <button className="hover:text-foreground">{comment.likes} likes</button>
                        <button className="hover:text-foreground">Reply</button>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-red-500">
                      <Heart className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            {/* Actions */}
            <div className="py-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleLike}
                    className={`transition-colors ${post.isLiked ? 'text-red-500' : 'hover:text-muted-foreground'}`}
                  >
                    <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="hover:text-muted-foreground transition-colors">
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
              <p className="font-semibold">{post.likes.toLocaleString()} likes</p>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleComment} className="flex items-center gap-3 pt-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-green text-green-foreground text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border-0 focus-visible:ring-0"
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
          </div>
        </div>
      </div>
    </div>
  )
}
