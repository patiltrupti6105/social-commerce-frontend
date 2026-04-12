import api from './axiosConfig'

// Admin API endpoints
export const adminApi = {
  // Dashboard stats
  getStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  },

  // User management
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role })
    return response.data
  },

  toggleUserStatus: async (userId, enabled) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { enabled })
    return response.data
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  // Product management
  getPendingProducts: async (params = {}) => {
    const response = await api.get('/admin/products/pending', { params })
    return response.data
  },

  approveProduct: async (productId) => {
    const response = await api.post(`/admin/products/${productId}/approve`)
    return response.data
  },

  rejectProduct: async (productId, reason) => {
    const response = await api.post(`/admin/products/${productId}/reject`, { reason })
    return response.data
  },

  // Post/Content management
  getReportedPosts: async (params = {}) => {
    const response = await api.get('/admin/posts/reported', { params })
    return response.data
  },

  resolveReport: async (postId, action) => {
    const response = await api.post(`/admin/posts/${postId}/resolve`, { action })
    return response.data
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/admin/posts/${postId}`)
    return response.data
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics', { params })
    return response.data
  },

  getSalesReport: async (params = {}) => {
    const response = await api.get('/admin/analytics/sales', { params })
    return response.data
  },

  getTopProducts: async (limit = 10) => {
    const response = await api.get('/admin/analytics/top-products', { params: { limit } })
    return response.data
  },

  getRevenueChart: async (period = 'month') => {
    const response = await api.get('/admin/analytics/revenue', { params: { period } })
    return response.data
  },
}

export default adminApi
