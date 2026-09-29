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

    notificationApi.getNotifications()
      .then(r => {
        const notifs = r.data.data || []
        setNotifications(notifs)
        setUnreadCount(notifs.filter(n => !n.read && !n.isRead).length)
      })
      .catch(() => {
        // Silently fail — bell badge stays at 0, non-blocking
      })

    // SSE for real-time push
    const token = localStorage.getItem('socialshop_token')
    const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
    try {
      const es = new EventSource(`${API}/notifications/subscribe?token=${token}`)
      es.onmessage = (e) => {
        try {
          const notif = JSON.parse(e.data)
          setNotifications(prev => [notif, ...prev])
          setUnreadCount(prev => prev + 1)
        } catch {
          // Malformed SSE payload — ignore
        }
      }
      es.onerror = () => es.close()
      eventSourceRef.current = es
    } catch {
      // SSE unavailable in this environment
    }

    return () => {
      eventSourceRef.current?.close()
    }
  }, [isAuthenticated])

  const markAsRead = async (id) => {
    // Optimistic update first — feels instant
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, isRead: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    try {
      await notificationApi.markAsRead(id)
    } catch {
      // Best-effort — UI already updated, no revert needed
    }
  }

  const markAllAsRead = async () => {
    setUnreadCount(0)
    setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })))
    try {
      await notificationApi.markAllAsRead(notifications)
    } catch {
      // Best-effort
    }
  }

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, setNotifications, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
