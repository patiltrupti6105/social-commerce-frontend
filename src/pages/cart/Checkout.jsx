import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Plus, MapPin, ShoppingBag, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { orderApi } from '@/api/orderApi'

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, cartTotal, refreshCart } = useCart()
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' })

  useEffect(() => {
    orderApi.getAddresses()
      .then(r => {
        const addrs = r.data.data || []
        setAddresses(addrs)
        const def = addrs.find(a => a.isDefault)
        if (def) setSelectedAddressId(def.id)
        else if (addrs.length > 0) setSelectedAddressId(addrs[0].id)
      })
      .catch(() => {})
  }, [])

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      const res = await orderApi.addAddress(newAddress)
      const added = res.data.data
      setAddresses(prev => [...prev, added])
      setSelectedAddressId(added.id)
      setShowNewAddressForm(false)
      setNewAddress({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address')
    }
  }

  const handleCheckout = async () => {
    if (!selectedAddressId) { setError('Please select a delivery address'); return }
    setIsProcessing(true)
    setError('')
    try {
      const orderRes = await orderApi.checkout(selectedAddressId)
      const orderId = orderRes.data.data.id
      try{await orderApi.mockPay(orderId)}catch(_){}
      try{await refreshCart()}catch(_){}
      navigate(`/orders/${orderId}/confirmation`)
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Check stock availability.')
    } finally {
      setIsProcessing(false)
    }
  }

  // CartItemDTO: flat fields — price, quantity directly on item
  const subtotal = cartTotal > 0 ? cartTotal : cartItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-orange/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-orange" />Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 && (
                  <RadioGroup value={String(selectedAddressId)} onValueChange={(v) => setSelectedAddressId(Number(v))} className="space-y-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className="flex items-start gap-3">
                        <RadioGroupItem value={String(addr.id)} id={String(addr.id)} className="mt-1" />
                        <label htmlFor={String(addr.id)}
                          className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-orange bg-orange/5' : 'border-border hover:border-orange/50'}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{addr.fullName}</p>
                              <p className="text-sm text-muted-foreground mt-1">{addr.phone}</p>
                              <p className="text-sm mt-2">{addr.addressLine1}<br />{addr.city}, {addr.state} {addr.pincode}</p>
                            </div>
                            {addr.isDefault && <span className="text-xs bg-orange/10 text-orange px-2 py-1 rounded">Default</span>}
                          </div>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {!showNewAddressForm && (
                  <Button variant="outline" className="w-full mt-4 border-dashed border-orange text-orange hover:bg-orange/10"
                    onClick={() => setShowNewAddressForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />Add New Address
                  </Button>
                )}

                {showNewAddressForm && (
                  <form onSubmit={handleAddAddress} className="mt-6 p-4 border rounded-lg space-y-4">
                    <h3 className="font-medium">New Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Full Name</Label><Input value={newAddress.fullName} onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))} required /></div>
                      <div className="space-y-2"><Label>Phone</Label><Input value={newAddress.phone} onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))} required /></div>
                    </div>
                    <div className="space-y-2"><Label>Street Address</Label><Input value={newAddress.addressLine1} onChange={e => setNewAddress(p => ({ ...p, addressLine1: e.target.value }))} required /></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>City</Label><Input value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} required /></div>
                      <div className="space-y-2"><Label>State</Label><Input value={newAddress.state} onChange={e => setNewAddress(p => ({ ...p, state: e.target.value }))} required /></div>
                      <div className="space-y-2"><Label>PIN</Label><Input value={newAddress.pincode} onChange={e => setNewAddress(p => ({ ...p, pincode: e.target.value }))} required /></div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-orange hover:bg-orange/90 text-orange-foreground">Save Address</Button>
                      <Button type="button" variant="outline" onClick={() => setShowNewAddressForm(false)}>Cancel</Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card className="border-orange/10">
              <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-green/5 border border-green/20">
                  <div className="flex items-center gap-2 text-green">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Mock Payment — No real charge</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24 border-orange/10">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange/10 to-orange/5 flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.productTitle}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">{formatPrice((item.price || 0) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-green">FREE</span></div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span><span className="text-orange">{formatPrice(subtotal)}</span>
                </div>
                <Button onClick={handleCheckout} disabled={isProcessing || !selectedAddressId || cartItems.length === 0}
                  className="w-full bg-orange hover:bg-orange/90 text-orange-foreground" size="lg">
                  {isProcessing ? <><Spinner className="mr-2" />Processing...</> : 'Confirm & Pay'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
