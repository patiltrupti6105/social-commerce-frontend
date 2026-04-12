import api from './axiosConfig'

// Post/Feed API endpoints
export const postApi = {
  // Get feed posts
  getFeed: async (params = {}) => {
    const response = await api.get('/posts/feed', { params })
    return response.data
  },

  // Get explore/trending posts
  getExplore: async (params = {}) => {
    const response = await api.get('/posts/explore', { params })
    return response.data
  },

  // Get single post by ID
  getPost: async (postId) => {
    const response = await api.get(`/posts/${postId}`)
    return response.data
  },

  // Create new post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData)
    return response.data
  },

  // Update post
  updatePost: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData)
    return response.data
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`)
    return response.data
  },

  // Like post
  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`)
    return response.data
  },

  // Unlike post
  unlikePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}/like`)
    return response.data
  },

  // Get post comments
  getComments: async (postId, params = {}) => {
    const response = await api.get(`/posts/${postId}/comments`, { params })
    return response.data
  },

  // Add comment to post
  addComment: async (postId, content) => {
    const response = await api.post(`/posts/${postId}/comments`, { content })
    return response.data
  },

  // Delete comment
  deleteComment: async (postId, commentId) => {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`)
    return response.data
  },

  // Report post
  reportPost: async (postId, reason) => {
    const response = await api.post(`/posts/${postId}/report`, { reason })
    return response.data
  },
}

export default postApi
