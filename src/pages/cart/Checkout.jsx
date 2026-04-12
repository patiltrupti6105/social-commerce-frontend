import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Plus, MapPin, ShoppingBag, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Demo saved addresses
const SAVED_ADDRESSES = [
  {
    id: '1',
    fullName: 'Alex Johnson',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    pincode: '10001',
    isDefault: true,
  },
  {
    id: '2',
    fullName: 'Alex Johnson',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Avenue',
    city: 'Brooklyn',
    state: 'NY',
    pincode: '11201',
    isDefault: false,
  },
]

// Demo cart summary
const CART_SUMMARY = {
  items: [
    { id: '1', title: 'Premium Wireless Headphones', price: 199.99, quantity: 1 },
    { id: '2', title: 'Mechanical Gaming Keyboard', price: 149.99, quantity: 2 },
    { id: '3', title: 'Wireless Ergonomic Mouse', price: 49.99, quantity: 1 },
  ],
  subtotal: 549.96,
  shipping: 0,
  tax: 43.99,
  total: 593.95,
}

export default function Checkout() {
  const navigate = useNavigate()
  const [selectedAddress, setSelectedAddress] = useState(
    SAVED_ADDRESSES.find(a => a.isDefault)?.id || SAVED_ADDRESSES[0]?.id
  )
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target
    setNewAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleAddAddress = (e) => {
    e.preventDefault()
    // In a real app, save the address to the backend
    setShowNewAddressForm(false)
    setNewAddress({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    })
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    // In a real app, create order via API
    navigate('/orders/new-order-123')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Address */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card className="border-orange/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Saved Addresses */}
                <RadioGroup
                  value={selectedAddress}
                  onValueChange={setSelectedAddress}
                  className="space-y-4"
                >
                  {SAVED_ADDRESSES.map((address) => (
                    <div key={address.id} className="flex items-start gap-3">
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <label
                        htmlFor={address.id}
                        className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedAddress === address.id
                            ? 'border-orange bg-orange/5'
                            : 'border-border hover:border-orange/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{address.fullName}</p>
                            <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                            <p className="text-sm mt-2">
                              {address.address}<br />
                              {address.city}, {address.state} {address.pincode}
                            </p>
                          </div>
                          {address.isDefault && (
                            <span className="text-xs bg-orange/10 text-orange px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Add New Address Button */}
                {!showNewAddressForm && (
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-dashed border-orange text-orange hover:bg-orange/10"
                    onClick={() => setShowNewAddressForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                )}

                {/* New Address Form */}
                {showNewAddressForm && (
                  <form onSubmit={handleAddAddress} className="mt-6 p-4 border rounded-lg space-y-4">
                    <h3 className="font-medium">Add New Address</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={newAddress.fullName}
                          onChange={handleNewAddressChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleNewAddressChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={newAddress.address}
                        onChange={handleNewAddressChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={newAddress.city}
                          onChange={handleNewAddressChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={newAddress.state}
                          onChange={handleNewAddressChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={newAddress.pincode}
                          onChange={handleNewAddressChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="bg-orange hover:bg-orange/90 text-orange-foreground">
                        Save Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewAddressForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Payment Method (placeholder) */}
            <Card className="border-orange/10">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Payment will be processed securely. For this demo, no actual payment is required.
                </p>
                <div className="mt-4 p-4 rounded-lg bg-green/5 border border-green/20">
                  <div className="flex items-center gap-2 text-green">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Demo Mode - No payment required</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Order Summary */}
          <div>
            <Card className="sticky top-24 border-orange/10">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {CART_SUMMARY.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange/10 to-orange/5 flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(CART_SUMMARY.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(CART_SUMMARY.tax)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-orange">{formatPrice(CART_SUMMARY.total)}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddress}
                  className="w-full bg-orange hover:bg-orange/90 text-orange-foreground"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Spinner className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Confirm & Pay'
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
