import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import ProductCard from '@/components/product/ProductCard'
import { Spinner } from '@/components/ui/spinner'
import { Search, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react'
import { cn } from '@/lib/utils'

// Demo products
const DEMO_PRODUCTS = [
  { id: '1', title: 'Premium Wireless Headphones - Noise Cancelling, 40hr Battery', price: 199.99, avgRating: 4.5, reviewCount: 234, primaryImageUrl: null, sellerName: 'TechGear Pro', category: 'electronics' },
  { id: '2', title: 'Mechanical Gaming Keyboard - RGB Backlit, Cherry MX Switches', price: 149.99, avgRating: 4.8, reviewCount: 567, primaryImageUrl: null, sellerName: 'GameZone', category: 'electronics' },
  { id: '3', title: 'Wireless Ergonomic Mouse - 2.4GHz, Silent Click', price: 49.99, avgRating: 4.2, reviewCount: 189, primaryImageUrl: null, sellerName: 'TechGear Pro', category: 'electronics' },
  { id: '4', title: 'USB-C Hub 7-in-1 - HDMI, SD Card, USB 3.0', price: 39.99, avgRating: 4.6, reviewCount: 412, primaryImageUrl: null, sellerName: 'ConnectHub', category: 'electronics' },
  { id: '5', title: 'Summer Floral Dress - Midi Length, Breathable Cotton', price: 79.99, avgRating: 4.4, reviewCount: 156, primaryImageUrl: null, sellerName: 'Fashion Forward', category: 'fashion' },
  { id: '6', title: 'Minimalist Watch - Leather Strap, Japanese Movement', price: 129.99, avgRating: 4.7, reviewCount: 298, primaryImageUrl: null, sellerName: 'TimeStyle', category: 'fashion' },
  { id: '7', title: 'Smart Home Speaker - Voice Control, Multi-room Audio', price: 89.99, avgRating: 4.3, reviewCount: 521, primaryImageUrl: null, sellerName: 'SmartLife', category: 'electronics' },
  { id: '8', title: 'Ceramic Plant Pot Set - Modern Design, Drainage Holes', price: 34.99, avgRating: 4.5, reviewCount: 87, primaryImageUrl: null, sellerName: 'Green Thumb', category: 'home' },
  { id: '9', title: 'Yoga Mat - Non-Slip, Extra Thick, Eco-Friendly', price: 44.99, avgRating: 4.6, reviewCount: 342, primaryImageUrl: null, sellerName: 'FitLife', category: 'sports' },
  { id: '10', title: 'Stainless Steel Water Bottle - Insulated, 32oz', price: 29.99, avgRating: 4.8, reviewCount: 678, primaryImageUrl: null, sellerName: 'EcoEssentials', category: 'sports' },
  { id: '11', title: 'LED Desk Lamp - Adjustable, Eye-Care, USB Charging', price: 54.99, avgRating: 4.4, reviewCount: 234, primaryImageUrl: null, sellerName: 'BrightSpace', category: 'home' },
  { id: '12', title: 'Wireless Charging Pad - Fast Charge, Qi Compatible', price: 24.99, avgRating: 4.1, reviewCount: 456, primaryImageUrl: null, sellerName: 'TechGear Pro', category: 'electronics' },
]

const CATEGORIES = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'home', label: 'Home & Garden' },
  { id: 'sports', label: 'Sports & Outdoors' },
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
]

function FilterSidebar({ 
  selectedCategories, 
  setSelectedCategories, 
  priceRange, 
  setPriceRange,
  onClearFilters,
  className 
}) {
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 500

  return (
    <div className={cn("space-y-6", className)}>
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Active Filters</span>
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-blue hover:text-blue/80">
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <Label htmlFor={category.id} className="text-sm cursor-pointer">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={500}
            step={10}
            className="[&_[role=slider]]:bg-blue"
          />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Min</Label>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="h-8"
              />
            </div>
            <span className="text-muted-foreground mt-5">-</span>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Max</Label>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating Filter */}
      <div>
        <h3 className="font-semibold mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              className="flex items-center gap-2 text-sm hover:text-blue transition-colors w-full text-left"
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= rating ? 'text-yellow-400' : 'text-muted-foreground/30'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [hasMore, setHasMore] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filter and sort products
  useEffect(() => {
    let filtered = [...DEMO_PRODUCTS]

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category))
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.avgRating - a.avgRating)
        break
      case 'newest':
        filtered.reverse()
        break
    }

    setProducts(filtered)
  }, [debouncedSearch, selectedCategories, priceRange, sortBy])

  const handleClearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 500])
    setSearchQuery('')
  }

  const loadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setProducts(prev => [...prev, ...DEMO_PRODUCTS.slice(0, 4).map((p, i) => ({
        ...p,
        id: `${p.id}-${prev.length + i}`,
      }))])
      setIsLoading(false)
      if (products.length >= 24) setHasMore(false)
    }, 1000)
  }

  const handleAddToCart = (productId) => {
    console.log('Added to cart:', productId)
    // In a real app, dispatch to cart store
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-blue/20 focus:border-blue"
            />
          </div>

          {/* Sort & View Controls */}
          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {selectedCategories.length > 0 && (
                    <Badge className="ml-2 bg-blue">{selectedCategories.length}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="hidden md:flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Tags */}
        {(selectedCategories.length > 0 || debouncedSearch) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {debouncedSearch && (
              <Badge variant="secondary" className="gap-1">
                Search: {debouncedSearch}
                <button onClick={() => setSearchQuery('')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCategories.map((cat) => (
              <Badge key={cat} variant="secondary" className="gap-1">
                {CATEGORIES.find(c => c.id === cat)?.label}
                <button onClick={() => setSelectedCategories(prev => prev.filter(c => c !== cat))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-4">
              Showing {products.length} results
            </p>

            {products.length > 0 ? (
              <>
                <div className={cn(
                  "grid gap-4",
                  viewMode === 'grid' 
                    ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1"
                )}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      disabled={isLoading}
                      className="border-blue text-blue hover:bg-blue/10"
                    >
                      {isLoading ? <Spinner className="mr-2" /> : null}
                      Load More Products
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold mb-2">No products found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
