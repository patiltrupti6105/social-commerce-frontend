import api from './axiosConfig'

export const socialApi = {
  getFeed: (page = 0, size = 20) => api.get('/posts/feed', { params: { page, size } }),
  getExplore: () => api.get('/posts/explore'),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.put(`/posts/${id}/like`),          // PUT not POST
  reportPost: (id) => api.put(`/posts/${id}/report`),      // PUT not POST
  getComments: (postId) => api.get(`/posts/${postId}/comments`),
  addComment: (postId, text) => api.post(`/posts/${postId}/comments`, { text }),
  deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
  getUserPosts: (authorId, page = 0, size = 20) => api.get(`/posts/user/${authorId}`, { params: { page, size } }),
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', null, { params: { productId } }),       // query param
  removeFromWishlist: (productId) => api.delete('/wishlist', { params: { productId } }),      // query param
}
