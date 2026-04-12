import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, Heart, MessageCircle } from 'lucide-react'

// Demo trending posts
const DEMO_TRENDING = [
  { id: '1', likes: 2345, comments: 89, aspect: 'square' },
  { id: '2', likes: 1876, comments: 156, aspect: 'tall' },
  { id: '3', likes: 3421, comments: 234, aspect: 'square' },
  { id: '4', likes: 987, comments: 45, aspect: 'wide' },
  { id: '5', likes: 4532, comments: 312, aspect: 'tall' },
  { id: '6', likes: 2109, comments: 178, aspect: 'square' },
  { id: '7', likes: 1543, comments: 67, aspect: 'square' },
  { id: '8', likes: 876, comments: 34, aspect: 'tall' },
  { id: '9', likes: 2987, comments: 201, aspect: 'square' },
  { id: '10', likes: 1234, comments: 89, aspect: 'wide' },
  { id: '11', likes: 3456, comments: 245, aspect: 'square' },
  { id: '12', likes: 678, comments: 23, aspect: 'square' },
]

const TRENDING_TAGS = [
  { tag: '#fashion', count: '12.5K' },
  { tag: '#tech', count: '8.2K' },
  { tag: '#home', count: '6.7K' },
  { tag: '#summer', count: '5.4K' },
  { tag: '#deals', count: '4.1K' },
]

function PostTile({ post }) {
  const [isHovered, setIsHovered] = useState(false)

  // Generate varying heights for masonry effect
  const getHeight = () => {
    switch (post.aspect) {
      case 'tall': return 'row-span-2'
      case 'wide': return 'col-span-2'
      default: return ''
    }
  }

  return (
    <Link to={`/posts/${post.id}`}>
      <div
        className={`relative group overflow-hidden rounded-lg cursor-pointer ${getHeight()}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Placeholder image */}
        <div className={`w-full ${post.aspect === 'tall' ? 'h-[400px]' : post.aspect === 'wide' ? 'h-[200px]' : 'h-[200px]'} bg-gradient-to-br from-green/20 to-green/5 flex items-center justify-center`}>
          <div className="w-16 h-16 rounded-xl bg-green/30 flex items-center justify-center">
            <span className="text-green text-2xl font-bold">SS</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-6 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-1 text-white">
            <Heart className="h-5 w-5 fill-white" />
            <span className="font-semibold">{post.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-white">
            <MessageCircle className="h-5 w-5 fill-white" />
            <span className="font-semibold">{post.comments}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('trending')

  const filteredPosts = DEMO_TRENDING // In real app, filter based on search

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts, products, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg rounded-full border-green/20 focus:border-green"
            />
          </div>
        </div>

        {/* Trending Tags */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <TrendingUp className="h-4 w-4 text-green" />
          <span className="text-sm font-medium mr-2">Trending:</span>
          {TRENDING_TAGS.map(({ tag, count }) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="bg-green/10 text-green hover:bg-green/20 cursor-pointer"
            >
              {tag} <span className="ml-1 text-xs text-muted-foreground">{count}</span>
            </Badge>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-center bg-transparent border-b rounded-none h-auto p-0 mb-6">
            <TabsTrigger 
              value="trending"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green data-[state=active]:bg-transparent px-6 py-3"
            >
              Trending
            </TabsTrigger>
            <TabsTrigger 
              value="recent"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green data-[state=active]:bg-transparent px-6 py-3"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger 
              value="following"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green data-[state=active]:bg-transparent px-6 py-3"
            >
              Following
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-0">
            {/* Masonry Grid */}
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {filteredPosts.map((post) => (
                <PostTile key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {filteredPosts.slice().reverse().map((post) => (
                <PostTile key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="following" className="mt-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Sign in to see posts from people you follow</p>
              <Link to="/login">
                <Badge className="bg-green hover:bg-green/90 text-green-foreground cursor-pointer">
                  Sign In
                </Badge>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
