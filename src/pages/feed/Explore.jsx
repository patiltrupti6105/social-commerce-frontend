import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Search, Heart, MessageCircle } from 'lucide-react'
import { socialApi } from '@/api/socialApi'

export default function Explore() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    socialApi.getExplore()
      .then(r => setPosts(r.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = searchQuery
    ? posts.filter(p => p.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search posts..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner className="h-8 w-8" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No posts found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            {filtered.map((post) => (
              <Link key={post.id} to={`/posts/${post.id}`} className="group relative aspect-square overflow-hidden bg-muted">
                {/* No mediaUrls in backend Post — show text-based placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-green/20 to-green/5 flex items-center justify-center p-3">
                  <p className="text-xs text-center text-muted-foreground line-clamp-4">{post.content}</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-white text-sm font-semibold">
                    <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{post.likesCount || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{post.commentsCount || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
