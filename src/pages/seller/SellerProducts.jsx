import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productApi } from '@/api/productApi'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Package, Plus } from 'lucide-react'

const STATUS_COLORS = {
  DRAFT: 'bg-muted text-muted-foreground',
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
  ACTIVE: 'bg-green/10 text-green',
  REJECTED: 'bg-red-100 text-red-600',
  ARCHIVED: 'bg-muted text-muted-foreground',
}

export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = () => {
    setLoading(true)
    productApi.getSellerProducts()
      .then(r => setProducts(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSubmit = async (id) => {
    await productApi.submitProduct(id)
    fetchProducts()
  }

  const handleArchive = async (id) => {
    await productApi.archiveProduct(id)
    fetchProducts()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Products</h2>
        <Link to="/seller/products/create">
          <Button className="bg-blue hover:bg-blue/90 text-blue-foreground">
            <Plus className="h-4 w-4 mr-2" />Add Product
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="h-6 w-6" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">No products yet</p>
          <Link to="/seller/products/create"><Button>Create your first product</Button></Link>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                        {p.primaryImageUrl
                          ? <img src={p.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                          : <Package className="h-5 w-5 m-2.5 text-muted-foreground/50" />}
                      </div>
                      <Link to={`/products/${p.id}`} className="font-medium hover:underline line-clamp-1">{p.title}</Link>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{formatPrice(p.price)}</td>
                  <td className="p-3"><Badge className={STATUS_COLORS[p.status] || 'bg-muted text-muted-foreground'}>{p.status}</Badge></td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {(p.status === 'DRAFT' || p.status === 'REJECTED') && (
                        <>
                          <Link to={`/seller/products/${p.id}/edit`}><Button size="sm" variant="outline">Edit</Button></Link>
                          <Button size="sm" onClick={() => handleSubmit(p.id)}>Submit</Button>
                        </>
                      )}
                      {p.status === 'ACTIVE' && (
                        <Button size="sm" variant="destructive" onClick={() => handleArchive(p.id)}>Archive</Button>
                      )}
                      {p.status === 'REJECTED' && p.rejectionReason && (
                        <span className="text-xs text-red-600 px-2 py-1">Reason: {p.rejectionReason}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
