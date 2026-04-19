import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import { notificationApi } from '@/api/notificationApi'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const eventSourceRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) return

    // Load notifications and compute unread count
    notificationApi.getNotifications()
      .then(r => {
        const notifs = r.data.data || []
        setNotifications(notifs)
        setUnreadCount(notifs.filter(n => !n.read && !n.isRead).length)
      })
      .catch(() => {})

    // SSE — backend uses /subscribe, auth is via Spring Security (Bearer token in header)
    // EventSource doesn't support custom headers, so we use the token in the URL as fallback
    const token = localStorage.getItem('socialshop_token')
    const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
    try {
      const es = new EventSource(`${API}/notifications/subscribe?token=${token}`)
      es.onmessage = (e) => {
        try {
          const notif = JSON.parse(e.data)
          setNotifications(prev => [notif, ...prev])
          setUnreadCount(prev => prev + 1)
        } catch (_) {}
      }
      es.onerror = () => es.close()
      eventSourceRef.current = es
    } catch (_) {}

    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close()
    }
  }, [isAuthenticated])

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id)
      setUnreadCount(prev => Math.max(0, prev - 1))
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, isRead: true } : n))
    } catch (_) {}
  }

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead(notifications)
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })))
    } catch (_) {}
  }

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, setNotifications, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
