import api from './axiosConfig'

// User/Profile API endpoints
export const userApi = {
  // Get user profile by ID
  getProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData)
    return response.data
  },

  // Update avatar
  updateAvatar: async (avatarUrl) => {
    const response = await api.patch('/users/me/avatar', { avatar: avatarUrl })
    return response.data
  },

  // Get user's posts
  getUserPosts: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/posts`, { params })
    return response.data
  },

  // Get user's followers
  getFollowers: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/followers`, { params })
    return response.data
  },

  // Get user's following
  getFollowing: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/following`, { params })
    return response.data
  },

  // Follow user
  followUser: async (userId) => {
    const response = await api.post(`/users/${userId}/follow`)
    return response.data
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    const response = await api.delete(`/users/${userId}/follow`)
    return response.data
  },

  // Block user
  blockUser: async (userId) => {
    const response = await api.post(`/users/${userId}/block`)
    return response.data
  },

  // Unblock user
  unblockUser: async (userId) => {
    const response = await api.delete(`/users/${userId}/block`)
    return response.data
  },
}

export default userApi
