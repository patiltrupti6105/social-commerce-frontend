import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Image, X, Search, Tag, Plus } from 'lucide-react'

// Demo products for tagging
const DEMO_PRODUCTS = [
  { id: '1', name: 'Premium Headphones', price: 199.99 },
  { id: '2', name: 'Wireless Mouse', price: 49.99 },
  { id: '3', name: 'Mechanical Keyboard', price: 149.99 },
  { id: '4', name: 'USB-C Hub', price: 39.99 },
  { id: '5', name: 'Monitor Stand', price: 79.99 },
  { id: '6', name: 'Webcam HD', price: 89.99 },
]

export default function CreatePost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [taggedProducts, setTaggedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [productSearchOpen, setProductSearchOpen] = useState(false)
  const [productSearch, setProductSearch] = useState('')

  const filteredProducts = DEMO_PRODUCTS.filter(
    p => p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
    !taggedProducts.find(tp => tp.id === p.id)
  )

  const handleAddProduct = (product) => {
    setTaggedProducts(prev => [...prev, product])
    setProductSearchOpen(false)
    setProductSearch('')
  }

  const handleRemoveProduct = (productId) => {
    setTaggedProducts(prev => prev.filter(p => p.id !== productId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In a real app, send post data to API
    console.log({
      imageUrl,
      caption,
      taggedProducts: taggedProducts.map(p => p.id),
    })

    setIsLoading(false)
    navigate('/feed')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Create Post</h1>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!caption.trim() || isLoading}
            className="bg-green hover:bg-green/90 text-green-foreground"
          >
            {isLoading ? <Spinner className="mr-2" /> : null}
            Share
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Preview Panel */}
          <Card className="border-green/20">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 border border-green/20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-green text-green-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user?.name || 'Your Name'}</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>

              {/* Image Preview */}
              <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-green/10 to-green/5 mb-4">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full flex flex-col items-center justify-center ${imageUrl ? 'hidden' : ''}`}
                >
                  <Image className="h-16 w-16 text-muted-foreground/30 mb-2" />
                  <span className="text-sm text-muted-foreground">Add an image URL</span>
                </div>
              </div>

              {/* Caption Preview */}
              <p className="text-sm">
                <span className="font-semibold mr-2">{user?.name || 'Your Name'}</span>
                {caption || 'Your caption will appear here...'}
              </p>

              {/* Tagged Products Preview */}
              {taggedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {taggedProducts.map((product) => (
                    <Badge key={product.id} variant="secondary" className="bg-green/10 text-green">
                      {product.name} - ${product.price}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Panel */}
          <div className="space-y-6">
            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a URL for your post image
              </p>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption for your post..."
                rows={5}
                className="resize-none"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Share what you love about this product</span>
                <span>{caption.length}/2000</span>
              </div>
            </div>

            {/* Tag Products */}
            <div className="space-y-2">
              <Label>Tag Products</Label>
              <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                    Search products to tag...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search products..." 
                      value={productSearch}
                      onValueChange={setProductSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup>
                        {filteredProducts.map((product) => (
                          <CommandItem
                            key={product.id}
                            onSelect={() => handleAddProduct(product)}
                            className="cursor-pointer"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {product.name}
                            <span className="ml-auto text-muted-foreground">
                              ${product.price}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Tagged Products List */}
              {taggedProducts.length > 0 && (
                <div className="space-y-2 mt-3">
                  {taggedProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-green/5 border border-green/10"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green" />
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-muted-foreground">${product.price}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button (Mobile) */}
            <Button 
              onClick={handleSubmit}
              disabled={!caption.trim() || isLoading}
              className="w-full bg-green hover:bg-green/90 text-green-foreground md:hidden"
            >
              {isLoading ? <Spinner className="mr-2" /> : null}
              Share Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
