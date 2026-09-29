import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productApi } from '@/api/productApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Plus, X } from 'lucide-react'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Gray']

export default function CreateProduct() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({ title: '', description: '', price: '', categoryId: '' })
  const [imageUrls, setImageUrls] = useState([''])
  const [variants, setVariants] = useState([{ size: '', color: '', stockQuantity: '', sku: '' }])

  useEffect(() => {
    productApi.getCategories().then(r => setCategories(r.data.data || r.data || [])).catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addVariant = () => setVariants(prev => [...prev, { size: '', color: '', stockQuantity: '', sku: '' }])
  const removeVariant = (i) => setVariants(prev => prev.filter((_, idx) => idx !== i))
  const updateVariant = (i, field, value) => setVariants(prev => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v))

  const addImageUrl = () => setImageUrls(prev => [...prev, ''])
  const removeImageUrl = (i) => setImageUrls(prev => prev.filter((_, idx) => idx !== i))
  const updateImageUrl = (i, value) => setImageUrls(prev => prev.map((u, idx) => idx === i ? value : u))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await productApi.createProduct({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        imageUrls: imageUrls.filter(Boolean),
        variants: variants.filter(v => v.sku).map(v => ({
          ...v,
          stockQuantity: parseInt(v.stockQuantity) || 0,
          priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
        })),
      })
      navigate('/seller/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-2xl font-bold">Create Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹) *</Label>
                  <Input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.categoryId} onValueChange={v => setFormData(p => ({ ...p, categoryId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Images (URLs)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder="https://..." value={url} onChange={e => updateImageUrl(i, e.target.value)} />
                  {imageUrls.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeImageUrl(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                <Plus className="h-4 w-4 mr-2" />Add Image URL
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Variants</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  <Plus className="h-4 w-4 mr-2" />Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3 relative">
                  {variants.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeVariant(i)}>
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">SKU *</Label>
                      <Input placeholder="SKU-001" value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Stock</Label>
                      <Input type="number" value={v.stockQuantity} onChange={e => updateVariant(i, 'stockQuantity', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Size</Label>
                      <Select value={v.size} onValueChange={val => updateVariant(i, 'size', val)}>
                        <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                        <SelectContent>{SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Color</Label>
                      <Select value={v.color} onValueChange={val => updateVariant(i, 'color', val)}>
                        <SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger>
                        <SelectContent>{COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving} className="flex-1 bg-blue hover:bg-blue/90 text-blue-foreground">
              {saving ? <><Spinner className="mr-2" />Saving...</> : 'Create Product (Draft)'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
