import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '@/api/adminApi'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectDialog, setRejectDialog] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const fetchProducts = () => {
    setLoading(true)
    adminApi.getPendingProducts()
      .then(r => setProducts(r.data.data?.content || r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleApprove = async (id) => {
    await adminApi.approveProduct(id)
    fetchProducts()
  }

  const handleReject = async () => {
    if (!rejectDialog) return
    await adminApi.rejectProduct(rejectDialog, rejectReason)
    setRejectDialog(null)
    setRejectReason('')
    fetchProducts()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pending Products ({products.length})</h2>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="h-6 w-6" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No pending products</div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium">Seller</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="p-3">
                    <Link to={`/products/${p.id}`} className="font-medium hover:underline line-clamp-1">{p.title}</Link>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.sellerName}</td>
                  <td className="p-3 font-medium">{formatPrice(p.price)}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green hover:bg-green/90 text-green-foreground" onClick={() => handleApprove(p.id)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => setRejectDialog(p.id)}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Product</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Reason for rejection</Label>
            <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Explain why this product is being rejected..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
