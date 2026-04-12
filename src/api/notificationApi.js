import api from './axiosConfig'

// Notification API endpoints
export const notificationApi = {
  // Get all notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params })
    return response.data
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count')
    return response.data
  },

  // Mark single notification as read
  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`)
    return response.data
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.post('/notifications/mark-all-read')
    return response.data
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`)
    return response.data
  },

  // Update notification preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/notifications/preferences', preferences)
    return response.data
  },

  // Get notification preferences
  getPreferences: async () => {
    const response = await api.get('/notifications/preferences')
    return response.data
  },
}

export default notificationApi
