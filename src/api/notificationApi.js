import api from './axiosConfig'

export const notificationApi = {
  getNotifications: () => api.get('/notifications'),
  // No unread-count endpoint in backend — derive from notifications list
  getUnreadCount: async () => {
    const res = await api.get('/notifications')
    const notifications = res.data.data || []
    const count = notifications.filter(n => !n.isRead).length
    return { data: { data: count } }
  },
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: async (notifications = []) => {
    const unread = notifications.filter(n => !n.isRead)
    await Promise.all(unread.map(n => api.put(`/notifications/${n.id}/read`)))
    return { data: { data: null } }
  },
  // SSE endpoint is /notifications/subscribe (not /stream)
  getSSEUrl: () => {
    const token = localStorage.getItem('socialshop_token')
    const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
    return `${API}/notifications/subscribe`
  },
}
