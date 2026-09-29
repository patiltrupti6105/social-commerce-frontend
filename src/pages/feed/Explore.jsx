import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Search, Heart, MessageCircle, Star, ShoppingCart, TrendingUp } from 'lucide-react'
import { socialApi } from '@/api/socialApi'
import { productApi } from '@/api/productApi'
import { formatPrice } from '@/lib/utils'

// ── Skeleton helpers ──────────────────────────────────────────────────────────
function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full" />
      ))}
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

// ── Post tile ─────────────────────────────────────────────────────────────────
function PostTile({ post }) {
  const hasMedia = post.mediaUrls?.length > 0
  return (
    <Link to={`/posts/${post.id}`} className="group relative aspect-square overflow-hidden bg-muted block">
      {hasMedia ? (
        <img src={post.mediaUrls[0]} alt="Post" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-green/20 to-green/5 flex items-center justify-center p-3">
          <p className="text-xs text-center text-muted-foreground line-clamp-5">{post.content}</p>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex items-center gap-4 text-white text-sm font-semibold drop-shadow">
          <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{post.likesCount || 0}</span>
          <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{post.commentsCount || 0}</span>
        </div>
      </div>
    </Link>
  )
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const image = product.primaryImageUrl || null
  return (
    <Link to={`/products/${product.id}`} className="group block space-y-2">
      <div className="aspect-square rounded-xl overflow-hidden bg-muted relative">
        {image ? (
          <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue/10 to-blue/5">
            <ShoppingCart className="h-8 w-8 text-blue/30" />
          </div>
        )}
        {product.avgRating > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {Number(product.avgRating).toFixed(1)}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium line-clamp-2 group-hover:text-blue transition-colors">{product.title}</p>
        <p className="text-sm font-bold text-blue mt-0.5">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}

// ── Explore page ──────────────────────────────────────────────────────────────
export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [draftQuery, setDraftQuery] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState('posts')

  const [posts, setPosts] = useState([])
  const [products, setProducts] = useState([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  // Load trending posts on mount
  useEffect(() => {
    setIsLoadingPosts(true)
    socialApi.getExplore()
      .then(r => setPosts(r.data.data || []))
      .catch(() => toast.error('Could not load posts'))
      .finally(() => setIsLoadingPosts(false))
  }, [])

  // Load products when tab switches to products or search runs
  const loadProducts = useCallback(async (q) => {
    setIsLoadingProducts(true)
    try {
      const res = await productApi.getProducts(q ? { q } : {})
      setProducts(res.data.data?.content || res.data.data || [])
    } catch {
      toast.error('Could not load products')
    } finally {
      setIsLoadingProducts(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'products') loadProducts(searchQuery)
  }, [activeTab, loadProducts])  // intentionally omit searchQuery here — search triggers separately

  const handleSearch = (e) => {
    e.preventDefault()
    const q = draftQuery.trim()
    setSearchQuery(q)
    setSearchParams(q ? { q } : {})
    if (activeTab === 'products') {
      loadProducts(q)
    } else {
      // Filter posts client-side (explore posts already loaded)
    }
  }

  const filteredPosts = searchQuery
    ? posts.filter(p => p.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-green" />
          <h1 className="text-xl font-bold">Explore</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Discover trending posts and products</p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === 'products' ? 'Search products...' : 'Search posts...'}
              value={draftQuery}
              onChange={(e) => setDraftQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="posts">
              Posts
              {filteredPosts.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">{filteredPosts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {isLoadingPosts ? (
              <PostGridSkeleton />
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>{searchQuery ? `No posts matching "${searchQuery}"` : 'No trending posts yet'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {filteredPosts.map(post => <PostTile key={post.id} post={post} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            {isLoadingProducts ? (
              <ProductGridSkeleton />
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>{searchQuery ? `No products matching "${searchQuery}"` : 'No products found'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
