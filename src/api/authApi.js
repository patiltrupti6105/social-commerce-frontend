import api from './axiosConfig'

// Authentication API endpoints
export const authApi = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword })
    return response.data
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token })
    return response.data
  },
}

export default authApi
