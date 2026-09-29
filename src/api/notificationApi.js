import api from './axiosConfig'

export const notificationApi = {
  getNotifications: (page = 0) => api.get('/notifications', { params: { page } }),
  // No unread-count endpoint in backend — derive from notifications list
  getUnreadCount: async () => {
    const res = await api.get('/notifications', { params: { page: 0 } })
    const payload = res.data.data
    const items = Array.isArray(payload) ? payload : (payload?.content ?? [])
    return { data: { data: items.filter(n => !n.read && !n.isRead).length } }
  },
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  // No mark-all-read endpoint — mark each unread one individually
  markAllAsRead: async (notifications = []) => {
    const unread = notifications.filter(n => !n.read && !n.isRead)
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
