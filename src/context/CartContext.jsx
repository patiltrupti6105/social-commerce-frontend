import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { cartApi } from '@/api/cartApi'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // cartItemCount = total quantity across all items
  const cartItemCount = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0)

  const refreshCart = async () => {
    if (!isAuthenticated) { setCartItems([]); return }
    setIsLoading(true)
    try {
      const res = await cartApi.getCart()
      // Backend returns CartDTO: { items: CartItemDTO[], total, itemCount }
      const cartDTO = res.data.data || {}
      setCartItems(cartDTO.items || [])
      setCartTotal(cartDTO.total || 0)
    } catch (_) {
      setCartItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { refreshCart() }, [isAuthenticated])

  const addItem = async (variantId, quantity = 1) => {
    if (!variantId) return
    await cartApi.addItem(variantId, quantity)
    await refreshCart()
  }

  const removeItem = async (itemId) => {
    await cartApi.removeItem(itemId)
    setCartItems(prev => prev.filter(i => i.id !== itemId))
  }

  const updateQty = async (itemId, quantity) => {
    if (quantity < 1) return removeItem(itemId)
    await cartApi.updateItem(itemId, quantity)
    // Optimistic update; refreshCart will sync
    setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
  }

  return (
    <CartContext.Provider value={{ cartItems, cartItemCount, cartTotal, addItem, removeItem, updateQty, refreshCart, isLoading }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
