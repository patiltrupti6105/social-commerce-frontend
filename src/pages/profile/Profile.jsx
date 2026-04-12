import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Settings, Grid3X3, Package, UserPlus, UserMinus } from 'lucide-react'

// Demo posts
const DEMO_POSTS = [
  { id: '1', imageUrl: null, likes: 234, comments: 12 },
  { id: '2', imageUrl: null, likes: 189, comments: 8 },
  { id: '3', imageUrl: null, likes: 456, comments: 23 },
  { id: '4', imageUrl: null, likes: 78, comments: 5 },
  { id: '5', imageUrl: null, likes: 321, comments: 15 },
  { id: '6', imageUrl: null, likes: 145, comments: 7 },
]

// Demo products for seller
const DEMO_PRODUCTS = [
  { id: '1', title: 'Premium Headphones', price: 199.99, imageUrl: null },
  { id: '2', title: 'Wireless Mouse', price: 49.99, imageUrl: null },
  { id: '3', title: 'Mechanical Keyboard', price: 149.99, imageUrl: null },
  { id: '4', title: 'USB-C Hub', price: 39.99, imageUrl: null },
]

export default function Profile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')

  // In a real app, fetch profile data based on id
  const isOwnProfile = user?.id === id
  const profileUser = isOwnProfile ? user : {
    id,
    name: 'Demo User',
    email: 'demo@example.com',
    bio: 'Passionate about quality products and great deals!',
    role: 'SELLER',
    avatar: null,
    followers: 1234,
    following: 567,
    posts: 45,
    storeName: 'Demo Store',
  }

  const isSeller = profileUser?.role === 'SELLER'

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
        {/* Avatar */}
        <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-purple/20">
          <AvatarImage src={profileUser?.avatar} alt={profileUser?.name} />
          <AvatarFallback className="bg-purple text-purple-foreground text-4xl">
            {profileUser?.name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">{profileUser?.name}</h1>
            {isSeller && (
              <Badge variant="secondary" className="w-fit">
                <Package className="h-3 w-3 mr-1" />
                Seller
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <p className="text-xl font-bold">{profileUser?.posts || 0}</p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{profileUser?.followers?.toLocaleString() || 0}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{profileUser?.following?.toLocaleString() || 0}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground mb-4">{profileUser?.bio || 'No bio yet'}</p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <Button asChild variant="outline">
                <Link to="/profile/me">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleFollow}
                  className={isFollowing 
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' 
                    : 'bg-purple hover:bg-purple/90 text-purple-foreground'
                  }
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
                <Button variant="outline">Message</Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger 
            value="posts" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple data-[state=active]:bg-transparent"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
          {isSeller && (
            <TabsTrigger 
              value="products" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple data-[state=active]:bg-transparent"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
          )}
        </TabsList>

        {/* Posts Grid */}
        <TabsContent value="posts" className="mt-6">
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {DEMO_POSTS.map((post) => (
              <Link key={post.id} to={`/posts/${post.id}`}>
                <div className="aspect-square relative group overflow-hidden rounded-sm">
                  <div className="w-full h-full bg-gradient-to-br from-green/20 to-green/5 flex items-center justify-center">
                    <Grid3X3 className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-sm">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Products Grid */}
        {isSeller && (
          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DEMO_PRODUCTS.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gradient-to-br from-blue/20 to-blue/5 flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
                      <p className="text-blue font-bold">${product.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
