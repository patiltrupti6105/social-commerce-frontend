import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Bell, Heart, MessageCircle, UserPlus, Package } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

// Demo notifications
const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    type: 'LIKE',
    message: 'John Doe liked your post',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'COMMENT',
    message: 'Sarah commented on your post: "Great product!"',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: 'FOLLOW',
    message: 'Mike started following you',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
  },
  {
    id: '4',
    type: 'ORDER_PLACED',
    message: 'Your order #1234 has been confirmed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: '5',
    type: 'LIKE',
    message: 'Emma liked your product listing',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
  },
]

const notificationIcons = {
  LIKE: Heart,
  COMMENT: MessageCircle,
  FOLLOW: UserPlus,
  ORDER_PLACED: Package,
}

const notificationColors = {
  LIKE: 'text-red-500',
  COMMENT: 'text-green',
  FOLLOW: 'text-blue',
  ORDER_PLACED: 'text-orange',
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-green hover:text-green/90"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.slice(0, 5).map((notification) => {
            const Icon = notificationIcons[notification.type] || Bell
            const iconColor = notificationColors[notification.type] || 'text-muted-foreground'
            
            return (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 cursor-pointer ${
                  !notification.read ? 'bg-accent/50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={`mt-0.5 ${iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-green shrink-0 mt-1.5" />
                )}
              </DropdownMenuItem>
            )
          })}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center">
          <Link to="/notifications" className="text-sm text-green hover:text-green/90">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
