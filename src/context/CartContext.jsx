import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'
import { cartApi } from '@/api/cartApi'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const cartItemCount = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) { setCartItems([]); setCartTotal(0); return }
    setIsLoading(true)
    try {
      const res = await cartApi.getCart()
      const cartDTO = res.data.data || {}
      setCartItems(cartDTO.items || [])
      setCartTotal(cartDTO.total || 0)
    } catch {
      // Cart load failures are silent — don't disrupt the page
      setCartItems([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => { refreshCart() }, [refreshCart])

  const addItem = async (variantId, quantity = 1) => {
    if (!variantId) return
    try {
      await cartApi.addItem(variantId, quantity)
      await refreshCart()
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to add item'
      toast.error(msg)
      throw err   // re-throw so callers (ProductDetail) can catch it too
    }
  }

  const removeItem = async (itemId) => {
    // Optimistic remove
    const prev = cartItems
    setCartItems(c => c.filter(i => i.id !== itemId))
    try {
      await cartApi.removeItem(itemId)
      setCartTotal(t => {
        const removed = prev.find(i => i.id === itemId)
        return removed ? t - (removed.price || 0) * removed.quantity : t
      })
    } catch (err) {
      setCartItems(prev)   // revert
      toast.error('Could not remove item from cart')
    }
  }

  const updateQty = async (itemId, quantity) => {
    if (quantity < 1) return removeItem(itemId)
    // Optimistic update
    const prev = cartItems
    setCartItems(c => c.map(i => i.id === itemId ? { ...i, quantity } : i))
    try {
      await cartApi.updateItem(itemId, quantity)
    } catch (err) {
      setCartItems(prev)   // revert
      toast.error('Could not update quantity')
    }
  }

  return (
    <CartContext.Provider value={{ cartItems, cartItemCount, cartTotal, addItem, removeItem, updateQty, refreshCart, isLoading }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
