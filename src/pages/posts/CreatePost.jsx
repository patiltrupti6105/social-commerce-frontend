import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Plus, X, Image, Tag } from 'lucide-react'
import { socialApi } from '@/api/socialApi'
import { productApi } from '@/api/productApi'

export default function CreatePost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [mediaUrls, setMediaUrls] = useState([''])
  const [taggedProductIds, setTaggedProductIds] = useState([])
  const [products, setProducts] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load available products for tagging (only if seller, or load all active)
  useEffect(() => {
    productApi.getProducts({ size: 50 })
      .then(r => setProducts(r.data.data?.content || []))
      .catch(() => {})
  }, [])

  const handleMediaUrlChange = (index, value) => {
    const updated = [...mediaUrls]
    updated[index] = value
    setMediaUrls(updated)
  }

  const addMediaUrl = () => {
    if (mediaUrls.length < 5) setMediaUrls([...mediaUrls, ''])
  }

  const removeMediaUrl = (index) => {
    if (mediaUrls.length > 1) setMediaUrls(mediaUrls.filter((_, i) => i !== index))
  }

  const toggleProductTag = (productId) => {
    setTaggedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    )
  }

  const handleSubmit = async () => {
    if (!content.trim()) { setError('Post content is required'); return }
    setIsSubmitting(true)
    setError('')
    try {
      const validUrls = mediaUrls.filter(u => u.trim())
      await socialApi.createPost({
        content,
        mediaUrls: validUrls,
        taggedProductIds,
      })
      navigate('/feed')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-2xl font-bold">Create Post</h1>
        </div>

        <Card className="border-green/20">
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl || user?.avatar} />
                <AvatarFallback className="bg-green text-green-foreground">{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Creating a post</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>What are you shopping for? *</Label>
              <Textarea
                placeholder="Share something with your followers..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">{content.length} characters</p>
            </div>

            {/* Image URLs */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Image className="h-4 w-4" /> Post Images (optional)</Label>
              {mediaUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Paste image URL (e.g. https://...)"
                    value={url}
                    onChange={(e) => handleMediaUrlChange(i, e.target.value)}
                    className="flex-1"
                  />
                  {url && (
                    <img src={url} alt="" className="h-9 w-9 rounded object-cover border"
                      onError={(e) => { e.target.style.display = 'none' }} />
                  )}
                  {mediaUrls.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeMediaUrl(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {mediaUrls.length < 5 && (
                <Button type="button" variant="outline" size="sm" onClick={addMediaUrl}>
                  <Plus className="h-3 w-3 mr-1" /> Add Image
                </Button>
              )}
            </div>

            {/* Product Tagging */}
            {products.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Tag className="h-4 w-4" /> Tag Products (optional)</Label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                  {products.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProductTag(p.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors
                        ${taggedProductIds.includes(p.id)
                          ? 'bg-green text-green-foreground border-green'
                          : 'hover:border-green/50'}`}
                    >
                      {p.primaryImageUrl && (
                        <img src={p.primaryImageUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                      )}
                      {p.title}
                    </button>
                  ))}
                </div>
                {taggedProductIds.length > 0 && (
                  <p className="text-xs text-muted-foreground">{taggedProductIds.length} product(s) tagged</p>
                )}
              </div>
            )}

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}
                className="flex-1 bg-green hover:bg-green/90 text-green-foreground">
                {isSubmitting ? <><Spinner className="mr-2" />Posting...</> : 'Share Post'}
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

