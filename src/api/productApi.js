import api from './axiosConfig'

export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/categories'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  submitProduct: (id) => api.post(`/products/${id}/submit`),
  archiveProduct: (id) => api.delete(`/products/${id}`),
  getSellerProducts: () => api.get('/products/seller/my'),
  getReviews: (productId, page = 0) => api.get(`/products/${productId}/reviews?page=${page}`),
  submitReview: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  deleteReview: (productId, reviewId) => api.delete(`/products/${productId}/reviews/${reviewId}`),
}
