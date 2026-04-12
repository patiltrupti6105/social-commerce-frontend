import api from './axiosConfig'

// Order API endpoints
export const orderApi = {
  // Get all orders for current user
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params })
    return response.data
  },

  // Get single order by ID
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  },

  // Create new order (checkout)
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/cancel`)
    return response.data
  },

  // Get order tracking info
  getOrderTracking: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/tracking`)
    return response.data
  },

  // Request return/refund
  requestReturn: async (orderId, reason) => {
    const response = await api.post(`/orders/${orderId}/return`, { reason })
    return response.data
  },

  // Reorder (add previous order items to cart)
  reorder: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/reorder`)
    return response.data
  },
}

export default orderApi
