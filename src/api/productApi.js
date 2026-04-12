import api from './axiosConfig'

// Product API endpoints
export const productApi = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await api.get('/products/search', { params: { q: query, ...params } })
    return response.data
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/products/categories')
    return response.data
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured')
    return response.data
  },

  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    const response = await api.get(`/products/${productId}/reviews`, { params })
    return response.data
  },

  // Add product review
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData)
    return response.data
  },

  // Get related products
  getRelatedProducts: async (productId) => {
    const response = await api.get(`/products/${productId}/related`)
    return response.data
  },
}

export default productApi
