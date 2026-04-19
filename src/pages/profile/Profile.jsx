import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Settings, Grid3X3, Package, UserPlus, UserMinus, Heart, MessageCircle } from 'lucide-react'
import { userApi } from '@/api/userApi'
import { socialApi } from '@/api/socialApi'
import { productApi } from '@/api/productApi'
import { formatPrice } from '@/lib/utils'

export default function Profile() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [products, setProducts] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  const isOwnProfile = currentUser?.id === id

  useEffect(() => {
    Promise.all([
      userApi.getProfile(id),
      socialApi.getUserPosts(id),
    ]).then(([profileRes, postsRes]) => {
      const p = profileRes.data.data
      setProfile(p)
      setIsFollowing(p.isFollowing || false)
      setPosts(postsRes.data.data?.content || postsRes.data.data || [])
      if (p.role === 'SELLER') {
        productApi.getProducts({ sellerId: id }).then(r => setProducts(r.data.data?.content || [])).catch(() => {})
      }
    }).catch(() => {})
    .finally(() => setIsLoading(false))
  }, [id])

  const handleFollow = async () => {
    setIsFollowLoading(true)
    try {
      if (isFollowing) {
        await userApi.unfollow(id)
        setIsFollowing(false)
        setProfile(prev => ({ ...prev, followersCount: (prev.followersCount || 1) - 1 }))
      } else {
        await userApi.follow(id)
        setIsFollowing(true)
        setProfile(prev => ({ ...prev, followersCount: (prev.followersCount || 0) + 1 }))
      }
    } catch (_) {} finally {
      setIsFollowLoading(false)
    }
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">User not found</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-start gap-8 mb-8">
          <Avatar className="h-24 w-24 border-2 border-purple/20">
            <AvatarImage src={profile.avatarUrl || profile.avatar} />
            <AvatarFallback className="bg-purple text-purple-foreground text-2xl">{profile.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-xl font-bold">{profile.name}</h1>
              {isOwnProfile ? (
                <Link to="/profile/me">
                  <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2" />Edit Profile</Button>
                </Link>
              ) : (
                <Button size="sm" onClick={handleFollow} disabled={isFollowLoading}
                  variant={isFollowing ? 'outline' : 'default'}
                  className={!isFollowing ? 'bg-purple hover:bg-purple/90 text-purple-foreground' : ''}>
                  {isFollowLoading ? <Spinner className="h-4 w-4" /> : isFollowing ? <><UserMinus className="h-4 w-4 mr-1" />Unfollow</> : <><UserPlus className="h-4 w-4 mr-1" />Follow</>}
                </Button>
              )}
            </div>
            {profile.storeName && <p className="text-sm text-muted-foreground mb-1">🏪 {profile.storeName}</p>}
            {profile.bio && <p className="text-sm mb-3">{profile.bio}</p>}
            <div className="flex gap-6 text-sm">
              <span><strong>{profile.postCount || posts.length}</strong> posts</span>
              <span><strong>{profile.followersCount || 0}</strong> followers</span>
              <span><strong>{profile.followingCount || 0}</strong> following</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="posts">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="posts" className="flex-1"><Grid3X3 className="h-4 w-4 mr-2" />Posts</TabsTrigger>
            {profile.role === 'SELLER' && <TabsTrigger value="products" className="flex-1"><Package className="h-4 w-4 mr-2" />Products</TabsTrigger>}
          </TabsList>

          <TabsContent value="posts">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No posts yet</div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {posts.map(post => {
                  const img = post.mediaUrls?.[0] || post.images?.[0]
                  return (
                    <Link key={post.id} to={`/posts/${post.id}`} className="group relative aspect-square overflow-hidden bg-muted">
                      {img ? <img src={img} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-purple/10 to-purple/5 flex items-center justify-center p-2"><p className="text-xs text-center text-muted-foreground line-clamp-3">{post.content}</p></div>}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-3 text-white text-sm font-semibold">
                          <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{post.likesCount || 0}</span>
                          <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{post.commentsCount || 0}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {profile.role === 'SELLER' && (
            <TabsContent value="products">
              {products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No products listed</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {products.map(p => (
                    <Link key={p.id} to={`/products/${p.id}`}>
                      <Card className="hover:border-blue/30 transition-colors overflow-hidden">
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          {p.primaryImageUrl ? <img src={p.primaryImageUrl} alt={p.title} className="w-full h-full object-cover" />
                            : <Package className="h-8 w-8 text-muted-foreground/30" />}
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                          <p className="text-sm text-blue font-semibold">{formatPrice(p.price)}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
