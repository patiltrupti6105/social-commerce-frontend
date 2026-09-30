import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productApi } from '@/api/productApi'
import { uploadApi } from '@/api/uploadApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Plus, X, ImagePlus } from 'lucide-react'
import { toast } from 'sonner'

const SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Gray']

const emptyVariant = () => ({ size: '', color: '', stockQuantity: '1', sku: '' })

export default function CreateProduct() {
  const navigate = useNavigate()

  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [categories, setCategories]   = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice]             = useState('')
  const [categoryId, setCategoryId]   = useState('')
  const [imageUrls, setImageUrls]     = useState([])
  const [variants, setVariants]       = useState([emptyVariant()])

  useEffect(() => {
    productApi.getCategories()
      .then(r => setCategories(r.data.data || r.data || []))
      .catch(() => {})
  }, [])

  // ── Image upload ────────────────────────────────────────────────────────
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

  // ── Variant helpers ──────────────────────────────────────────────────────
  const addVariant    = () => setVariants(prev => [...prev, emptyVariant()])
  const removeVariant = (i) => setVariants(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev)
  const updateVariant = (i, field, value) =>
    setVariants(prev => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v))

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    if (!price || parseFloat(price) <= 0) { setError('Valid price is required'); return }
    setSaving(true)
    setError('')
    try {
      await productApi.createProduct({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        categoryId: categoryId ? parseInt(categoryId) : null,
        imageUrls,
        variants: variants
          .filter(v => v.sku || v.size || v.color || v.stockQuantity)
          .map(v => ({
            size: v.size || null,
            color: v.color || null,
            stockQuantity: parseInt(v.stockQuantity) || 0,
            sku: v.sku || null,
          })),
      })
      toast.success('Product created — submit for review when ready')
      navigate('/seller/products')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Create Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic info */}
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Wireless Bluetooth Headphones" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe your product..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input id="price" type="number" step="0.01" min="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images — file upload, not URL input */}
          <Card>
            <CardHeader><CardTitle>Images ({imageUrls.length}/5)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative group w-24 h-24">
                      <img src={url} alt="" className="w-24 h-24 rounded-lg object-cover bg-muted"
                        onError={e => { e.target.style.display = 'none' }} />
                      <button type="button"
                        onClick={() => setImageUrls(prev => prev.filter((_, j) => j !== i))}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">Main</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {imageUrls.length < 5 && (
                <label className={`flex items-center gap-2 w-fit px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  {isUploading
                    ? <Spinner className="h-4 w-4" />
                    : <ImagePlus className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? 'Uploading...' : 'Add images'}
                  </span>
                  <input type="file" accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple className="hidden"
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
              {variants.map((v, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3 relative">
                  {variants.length > 1 && (
                    <Button type="button" variant="ghost" size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-destructive"
                      onClick={() => removeVariant(i)}>
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">SKU</Label>
                      <Input placeholder="SKU-001" value={v.sku}
                        onChange={e => updateVariant(i, 'sku', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Stock Qty</Label>
                      <Input type="number" min="0" value={v.stockQuantity}
                        onChange={e => updateVariant(i, 'stockQuantity', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Size</Label>
                      <Select value={v.size} onValueChange={val => updateVariant(i, 'size', val)}>
                        <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                        <SelectContent>
                          {SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Color</Label>
                      <Select value={v.color} onValueChange={val => updateVariant(i, 'color', val)}>
                        <SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger>
                        <SelectContent>
                          {COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving || isUploading}
              className="flex-1 bg-blue hover:bg-blue/90 text-blue-foreground">
              {saving
                ? <><Spinner className="mr-2 h-4 w-4" />Saving...</>
                : 'Create Product (Draft)'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
