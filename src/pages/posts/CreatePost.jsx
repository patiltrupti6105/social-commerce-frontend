import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, ImagePlus, X, ShoppingBag, Search, Tag } from 'lucide-react'
import { socialApi } from '@/api/socialApi'
import { uploadApi } from '@/api/uploadApi'
import { productApi } from '@/api/productApi'
import { formatPrice } from '@/lib/utils'

const MAX_IMAGES = 4
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export default function CreatePost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [content, setContent]           = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews]           = useState([])
  const [isSubmitting, setIsSubmitting]   = useState(false)

  // Product linking
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [productQuery, setProductQuery]           = useState('')
  const [productResults, setProductResults]       = useState([])
  const [isSearching, setIsSearching]             = useState(false)
  const [linkedProduct, setLinkedProduct]         = useState(null) // { id, title, price, primaryImageUrl }

  // ── Image selection ──────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    const valid = files.filter(f => {
      if (!ALLOWED_TYPES.includes(f.type)) { toast.error(`${f.name}: unsupported type`); return false }
      if (f.size > 10 * 1024 * 1024) { toast.error(`${f.name}: max 10 MB`); return false }
      return true
    })
    if (selectedFiles.length + valid.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images`)
      return
    }
    setPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))])
    setSelectedFiles(prev => [...prev, ...valid])
    e.target.value = ''
  }

  const removeImage = (idx) => {
    URL.revokeObjectURL(previews[idx])
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return []
    const results = await Promise.all(selectedFiles.map(f => uploadApi.uploadImage(f)))
    return results.map(r => r.data.data.url)
  }

  // ── Product search (debounced) ────────────────────────────────────────────
  useEffect(() => {
    if (!productQuery.trim()) { setProductResults([]); return }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await productApi.getProducts({ q: productQuery, size: 6 })
        setProductResults(res.data.data?.content || [])
      } catch {
        setProductResults([])
      } finally {
        setIsSearching(false)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [productQuery])

  const selectProduct = (product) => {
    setLinkedProduct(product)
    setShowProductSearch(false)
    setProductQuery('')
    setProductResults([])
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!content.trim()) { toast.error('Post content is required'); return }
    setIsSubmitting(true)
    try {
      const mediaUrls = await uploadImages()
      await socialApi.createPost({
        content,
        mediaUrls,
        linkedProductId: linkedProduct?.id ?? null,
      })
      toast.success('Post shared!')
      previews.forEach(URL.revokeObjectURL)
      navigate('/feed')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Create Post</h1>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Author row */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl || user?.avatar} />
                <AvatarFallback className="bg-green text-green-foreground">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Creating a post</p>
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="post-content">What are you sharing?</Label>
              <Textarea
                id="post-content"
                placeholder="Share something with your followers..."
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">{content.length} / 2200</p>
            </div>

            {/* Image previews */}
            {previews.length > 0 && (
              <div className={`grid gap-2 ${previews.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {previews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                      aria-label="Remove image">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add images */}
            {previews.length < MAX_IMAGES && (
              <>
                <input ref={fileInputRef} type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple onChange={handleFileSelect} className="hidden" />
                <Button type="button" variant="outline" className="w-full border-dashed"
                  onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus className="h-4 w-4 mr-2" />
                  {previews.length === 0 ? 'Add photos' : `Add more (${previews.length}/${MAX_IMAGES})`}
                </Button>
              </>
            )}

            {/* ── Product tag section ──────────────────────────────────── */}
            {linkedProduct ? (
              // Linked product preview card
              <div className="flex items-center gap-3 p-3 rounded-lg border border-blue/30 bg-blue/5">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {linkedProduct.primaryImageUrl
                    ? <img src={linkedProduct.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                    : <ShoppingBag className="h-5 w-5 m-3.5 text-muted-foreground/40" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{linkedProduct.title}</p>
                  <p className="text-sm text-blue font-semibold">{formatPrice(linkedProduct.price)}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground shrink-0"
                  onClick={() => setLinkedProduct(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // Tag product button
              <Button type="button" variant="outline" className="w-full border-dashed text-muted-foreground"
                onClick={() => setShowProductSearch(s => !s)}>
                <Tag className="h-4 w-4 mr-2" />
                Tag a product
              </Button>
            )}

            {/* Product search dropdown */}
            {showProductSearch && !linkedProduct && (
              <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
                <Label>Search products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    autoFocus
                    placeholder="Search by product name..."
                    value={productQuery}
                    onChange={e => setProductQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {isSearching && (
                  <div className="flex justify-center py-2"><Spinner className="h-5 w-5" /></div>
                )}

                {!isSearching && productResults.length > 0 && (
                  <div className="space-y-1 max-h-56 overflow-y-auto">
                    {productResults.map(p => (
                      <button key={p.id} type="button"
                        onClick={() => selectProduct(p)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          {p.primaryImageUrl
                            ? <img src={p.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                            : <ShoppingBag className="h-4 w-4 m-3 text-muted-foreground/40" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                          <p className="text-xs text-blue font-semibold">{formatPrice(p.price)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!isSearching && productQuery.trim() && productResults.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">No products found</p>
                )}

                <Button type="button" variant="ghost" size="sm" className="w-full text-muted-foreground"
                  onClick={() => { setShowProductSearch(false); setProductQuery(''); setProductResults([]) }}>
                  Cancel
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}
                className="flex-1 bg-green hover:bg-green/90 text-green-foreground">
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Posting...</> : 'Share Post'}
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
