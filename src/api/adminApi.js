import api from './axiosConfig'

export const adminApi = {
  getUsers: (page=0) => api.get(`/admin/users?page=${page}`),
  disableUser: (uuid) => api.put(`/admin/users/${uuid}/disable`),
  enableUser: (uuid) => api.put(`/admin/users/${uuid}/enable`),
  grantSeller: (uuid) => api.put(`/admin/users/${uuid}/grant-seller`),
  getPendingProducts: (page=0) => api.get(`/admin/products/pending?page=${page}`),
  approveProduct: (id) => api.post(`/admin/products/${id}/approve`),
  rejectProduct: (id, reason) => api.post(`/admin/products/${id}/reject`, { reason }),
  getReportedPosts: () => api.get('/admin/posts/reported'),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
  getAnalytics: () => api.get('/admin/analytics/overview'),
  getTopProducts: () => api.get('/admin/analytics/top-products'),
  getOrdersByDay: () => api.get('/admin/analytics/orders-by-day'),
}
