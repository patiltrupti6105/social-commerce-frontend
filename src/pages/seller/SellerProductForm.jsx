import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { productApi } from '@/api/productApi'
import { uploadApi } from '@/api/uploadApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Plus, X, ImagePlus } from 'lucide-react'

// Mirrors the seeded categories from V1__initial_schema.sql
const CATEGORIES = [
  { id: 1,  name: 'Electronics' },
  { id: 2,  name: 'Fashion' },
  { id: 3,  name: 'Home & Garden' },
  { id: 4,  name: 'Sports & Outdoors' },
  { id: 5,  name: 'Books' },
  { id: 6,  name: 'Toys & Games' },
  { id: 7,  name: 'Health & Beauty' },
  { id: 8,  name: 'Automotive' },
  { id: 9,  name: 'Other' },
]

const emptyVariant = () => ({ size: '', color: '', stockQuantity: 1, sku: '', priceOverride: '' })

export default function SellerProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice]             = useState('')
  const [categoryId, setCategoryId]   = useState('')
  const [imageUrls, setImageUrls]     = useState([])
  const [variants, setVariants]       = useState([emptyVariant()])
  const [isLoading, setIsLoading]     = useState(isEditing)
  const [isSaving, setIsSaving]       = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Load existing product when editing
  useEffect(() => {
    if (!isEditing) return
    productApi.getProductById(id)
      .then(r => {
        const p = r.data.data
        setTitle(p.title || '')
        setDescription(p.description || '')
        setPrice(p.price?.toString() || '')
        setCategoryId(p.categoryId?.toString() || '')
        setImageUrls(p.imageUrls || [])
        setVariants(
          p.variants?.length > 0
            ? p.variants.map(v => ({
                size: v.size || '',
                color: v.color || '',
                stockQuantity: v.stockQuantity ?? 1,
                sku: v.sku || '',
                priceOverride: v.priceOverride?.toString() || '',
              }))
            : [emptyVariant()]
        )
      })
      .catch(() => toast.error('Could not load product'))
      .finally(() => setIsLoading(false))
  }, [id, isEditing])

  // ── Image upload ───────────────────────────────────────────────────────────
  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (imageUrls.length + files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }
    setIsUploading(true)
    try {
      const results = await Promise.all(files.map(f => uploadApi.uploadImage(f)))
      const newUrls = results.map(r => r.data.data.url)
      setImageUrls(prev => [...prev, ...newUrls])
    } catch {
      toast.error('Image upload failed')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  // ── Variant helpers ────────────────────────────────────────────────────────
  const updateVariant = (idx, field, value) =>
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v))

  const addVariant = () => setVariants(prev => [...prev, emptyVariant()])

  const removeVariant = (idx) =>
    setVariants(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) { toast.error('Title is required'); return }
    if (!price || parseFloat(price) <= 0) { toast.error('Valid price is required'); return }

    setIsSaving(true)
    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      categoryId: categoryId ? parseInt(categoryId) : null,
      imageUrls,
      variants: variants
        .filter(v => v.stockQuantity > 0 || v.sku || v.size || v.color)
        .map(v => ({
          size: v.size || null,
          color: v.color || null,
          stockQuantity: parseInt(v.stockQuantity) || 0,
          sku: v.sku || null,
          priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
        })),
    }

    try {
      if (isEditing) {
        await productApi.updateProduct(id, payload)
        toast.success('Product updated')
      } else {
        await productApi.createProduct(payload)
        toast.success('Product created — submit for review when ready')
      }
      navigate('/seller/products')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Product' : 'New Product'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic info */}
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Wireless Bluetooth Headphones" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe your product..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input id="price" type="number" step="0.01" min="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader><CardTitle>Images ({imageUrls.length}/5)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative group w-24 h-24">
                      <img src={url} alt="" className="w-24 h-24 rounded-lg object-cover bg-muted" onError={e => { e.target.style.display = 'none' }} />
                      <button type="button" onClick={() => setImageUrls(prev => prev.filter((_, j) => j !== i))}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                      {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">Main</span>}
                    </div>
                  ))}
                </div>
              )}
              {imageUrls.length < 5 && (
                <label className={`flex items-center gap-2 w-fit px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  {isUploading ? <Spinner className="h-4 w-4" /> : <ImagePlus className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm text-muted-foreground">{isUploading ? 'Uploading...' : 'Add images'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple className="hidden"
                    onChange={handleImageFiles} disabled={isUploading} />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Variants & Stock</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  <Plus className="h-4 w-4 mr-1" />Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((v, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Variant {idx + 1}</span>
                    {variants.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(idx)} className="text-destructive h-7 px-2">
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Size</Label>
                      <Input value={v.size} onChange={e => updateVariant(idx, 'size', e.target.value)} placeholder="e.g. M, L, XL" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Color</Label>
                      <Input value={v.color} onChange={e => updateVariant(idx, 'color', e.target.value)} placeholder="e.g. Red, Blue" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Stock Qty *</Label>
                      <Input type="number" min="0" value={v.stockQuantity} onChange={e => updateVariant(idx, 'stockQuantity', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">SKU</Label>
                      <Input value={v.sku} onChange={e => updateVariant(idx, 'sku', e.target.value)} placeholder="SKU-001" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <Label className="text-xs">Price Override (leave blank to use base price)</Label>
                      <Input type="number" step="0.01" min="0" value={v.priceOverride} onChange={e => updateVariant(idx, 'priceOverride', e.target.value)} placeholder="Optional" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSaving} className="flex-1 bg-blue hover:bg-blue/90 text-blue-foreground">
              {isSaving ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : isEditing ? 'Update Product' : 'Create Product'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
