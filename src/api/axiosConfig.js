import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com'

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('socialshop_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // In a real app, this would refresh the token
      // For demo, we'll just logout
      localStorage.removeItem('socialshop_token')
      localStorage.removeItem('socialshop_user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
