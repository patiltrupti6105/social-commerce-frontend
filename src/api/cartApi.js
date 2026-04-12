import api from './axiosConfig'

// Cart API endpoints
export const cartApi = {
  // Get current user's cart
  getCart: async () => {
    const response = await api.get('/cart')
    return response.data
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, variantId = null) => {
    const response = await api.post('/cart/items', { productId, quantity, variantId })
    return response.data
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await api.patch(`/cart/items/${itemId}`, { quantity })
    return response.data
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`)
    return response.data
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await api.delete('/cart')
    return response.data
  },

  // Apply coupon code
  applyCoupon: async (couponCode) => {
    const response = await api.post('/cart/coupon', { code: couponCode })
    return response.data
  },

  // Remove coupon
  removeCoupon: async () => {
    const response = await api.delete('/cart/coupon')
    return response.data
  },

  // Get cart totals
  getCartTotals: async () => {
    const response = await api.get('/cart/totals')
    return response.data
  },
}

export default cartApi
