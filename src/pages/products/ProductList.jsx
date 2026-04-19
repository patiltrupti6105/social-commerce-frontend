import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import ProductCard from '@/components/product/ProductCard'
import { Spinner } from '@/components/ui/spinner'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { productApi } from '@/api/productApi'
import { useCart } from '@/context/CartContext'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Rating' },
]

export default function ProductList() {
  const [searchParams] = useSearchParams()
  const { addItem } = useCart()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    q: searchParams.get('search') || searchParams.get('q') || '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    page: 0,
  })
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(filters.q)

  useEffect(() => {
    productApi.getCategories().then(r => setCategories(r.data.data || r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setIsLoading(true)
    productApi.getProducts(filters)
      .then(r => {
        setProducts(r.data.data?.content || [])
        setTotalPages(r.data.data?.totalPages || 0)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [filters])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, q: searchInput, page: 0 }))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const clearFilters = () => {
    setSearchInput('')
    setFilters({ q: '', categoryId: '', minPrice: '', maxPrice: '', sortBy: 'newest', page: 0 })
  }

  const activeFilterCount = [filters.categoryId, filters.minPrice, filters.maxPrice]
    .filter(Boolean).length

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold mb-3 block">Category</Label>
        <div className="space-y-2">
          <button
            onClick={() => setFilters(prev => ({ ...prev, categoryId: '', page: 0 }))}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!filters.categoryId ? 'bg-blue/10 text-blue font-medium' : 'hover:bg-accent'}`}>
            All Categories
          </button>
          {categories.map(cat => (
            <button key={cat.id}
              onClick={() => setFilters(prev => ({ ...prev, categoryId: String(cat.id), page: 0 }))}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${filters.categoryId === String(cat.id) ? 'bg-blue/10 text-blue font-medium' : 'hover:bg-accent'}`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
        <div className="flex items-center gap-2">
          <Input placeholder="Min" type="number" value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value, page: 0 }))} className="w-full" />
          <span className="text-muted-foreground">–</span>
          <Input placeholder="Max" type="number" value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value, page: 0 }))} className="w-full" />
        </div>
      </div>
      {activeFilterCount > 0 && (
        <Button variant="ghost" onClick={clearFilters} className="w-full text-destructive">
          <X className="h-4 w-4 mr-2" /> Clear Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)} className="pl-10" />
            </div>
            <Select value={filters.sortBy} onValueChange={(v) => setFilters(prev => ({ ...prev, sortBy: v, page: 0 }))}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><FilterContent /></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterContent />
          </aside>
          <main className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-blue" /></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(p => (
                    <ProductCard key={p.id} id={p.id} title={p.title} price={p.price}
                      avgRating={p.avgRating} reviewCount={p.reviewCount}
                      primaryImageUrl={p.primaryImageUrl} sellerName={p.sellerName}
                      onAddToCart={(id) => addItem(p.defaultVariantId || p.variants?.[0]?.id, 1)} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button variant="outline" disabled={filters.page === 0}
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}>Previous</Button>
                    <span className="flex items-center text-sm text-muted-foreground px-4">
                      Page {filters.page + 1} of {totalPages}
                    </span>
                    <Button variant="outline" disabled={filters.page >= totalPages - 1}
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}>Next</Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
