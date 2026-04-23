import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Heart, MessageCircle, Send } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
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

  useEffect(() => {
    Promise.all([socialApi.getPost(id), socialApi.getComments(id)])
      .then(([postRes, commentsRes]) => {
        setPost(postRes.data.data)
        // Backend returns List<Comment> directly (not paginated)
        setComments(commentsRes.data.data || [])
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [id])

  const handleLike = async () => {
    try {
      const res = await socialApi.likePost(id) // PUT
      const updated = res.data.data
      setPost(prev => ({ ...prev, likesCount: updated.likesCount, likedByUserIds: updated.likedByUserIds }))
    } catch (_) {
      setPost(prev => {
        const userId = String(user?.id)
        const liked = prev.likedByUserIds?.includes(userId)
        return {
          ...prev,
          likesCount: (prev.likesCount || 0) + (liked ? -1 : 1),
          likedByUserIds: liked ? prev.likedByUserIds.filter(i => i !== userId) : [...(prev.likedByUserIds || []), userId]
        }
      })
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
    } catch (_) {} finally { setIsSubmitting(false) }
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>
  if (!post) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Post not found</div>

  const isLiked = post.likedByUserIds?.includes(String(user?.id))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />Back
        </Button>

        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {post.mediaUrls && post.mediaUrls.length > 0 ? (
              <div className="aspect-square bg-muted overflow-hidden">
                <img src={post.mediaUrls[0]} alt="Post" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-green/10 to-green/5 flex items-center justify-center">
                <span className="text-green text-6xl font-bold">SS</span>
              </div>
            )}

            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 p-4 border-b">
                <Link to={`/profile/${post.authorId}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green text-green-foreground">
                      {post.authorId?.charAt(0)?.toUpperCase()}
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

              <div className="flex-1 overflow-y-auto p-4 max-h-80">
                {/* Backend Post uses 'content' not 'caption' */}
                <p className="text-sm mb-4">{post.content}</p>
                <Separator className="mb-4" />
                <div className="space-y-3">
                  {comments.map(c => (
                    <div key={c.id} className="flex items-start gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">
                          {c.authorId?.charAt(0)?.toUpperCase() || 'U'}
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
              </div>

              <div className="border-t p-4">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={handleLike} className={`transition-colors ${isLiked ? 'text-red-500' : 'hover:text-muted-foreground'}`}>
                    <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold mb-3">{(post.likesCount || 0).toLocaleString()} likes</p>
                <form onSubmit={handleComment} className="flex items-center gap-2">
                  <Input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..." className="flex-1 text-sm" />
                  <Button type="submit" size="sm" variant="ghost" disabled={!commentText.trim() || isSubmitting}>
                    <Send className="h-4 w-4" />
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
