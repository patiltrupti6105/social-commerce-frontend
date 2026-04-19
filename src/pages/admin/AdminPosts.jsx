import { useState, useEffect } from 'react'
import { adminApi } from '@/api/adminApi'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trash2 } from 'lucide-react'

export default function AdminPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = () => {
    setLoading(true)
    adminApi.getReportedPosts()
      .then(r => setPosts(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPosts() }, [])

  const handleDelete = async (id) => {
    await adminApi.deletePost(id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Reported Posts ({posts.length})</h2>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="h-6 w-6" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No reported posts</div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="flex items-start gap-4 p-4 rounded-lg border">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={post.author?.avatar} />
                <AvatarFallback>{post.author?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{post.author?.name}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{post.caption || post.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(post.createdAt)}</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>
                <Trash2 className="h-4 w-4 mr-1" />Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
