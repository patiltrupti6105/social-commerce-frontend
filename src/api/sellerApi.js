import api from './axiosConfig'

// Seller API endpoints
export const sellerApi = {
  // Get seller dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/seller/stats')
    return response.data
  },

  // Get seller's products
  getProducts: async (params = {}) => {
    const response = await api.get('/seller/products', { params })
    return response.data
  },

  // Get single product
  getProduct: async (productId) => {
    const response = await api.get(`/seller/products/${productId}`)
    return response.data
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await api.post('/seller/products', productData)
    return response.data
  },

  // Update product
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/seller/products/${productId}`, productData)
    return response.data
  },

  // Delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/seller/products/${productId}`)
    return response.data
  },

  // Get seller's orders
  getOrders: async (params = {}) => {
    const response = await api.get('/seller/orders', { params })
    return response.data
  },

  // Update order status (ship/deliver)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/seller/orders/${orderId}`, { status })
    return response.data
  },

  // Get sales analytics
  getAnalytics: async (params = {}) => {
    const response = await api.get('/seller/analytics', { params })
    return response.data
  },

  // Get top selling products
  getTopProducts: async (limit = 10) => {
    const response = await api.get('/seller/products/top', { params: { limit } })
    return response.data
  },
}

export default sellerApi
