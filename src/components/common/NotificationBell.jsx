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
import { useNotifications } from '@/context/NotificationContext'

const notificationIcons = {
  LIKE: Heart,
  COMMENT: MessageCircle,
  FOLLOW: UserPlus,
  ORDER_PLACED: Package,
}

const notificationColors = {
  LIKE: 'text-red-500',
  COMMENT: 'text-blue',
  FOLLOW: 'text-purple',
  ORDER_PLACED: 'text-orange',
}

export default function NotificationBell() {
  const { unreadCount, notifications, markAsRead } = useNotifications()
  const [open, setOpen] = useState(false)

  const recentNotifications = notifications.slice(0, 5)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3 pb-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
          )}
        </div>
        <DropdownMenuSeparator />
        {recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
        ) : (
          recentNotifications.map((notif) => {
            const Icon = notificationIcons[notif.type] || Bell
            const colorClass = notificationColors[notif.type] || 'text-muted-foreground'
            return (
              <DropdownMenuItem
                key={notif.id}
                className={`p-3 cursor-pointer ${!notif.read && !notif.isRead ? 'bg-accent/50' : ''}`}
                onClick={() => !notif.read && !notif.isRead && markAsRead(notif.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colorClass}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(notif.createdAt || notif.timestamp)}
                    </p>
                  </div>
                  {!notif.read && !notif.isRead && <div className="w-2 h-2 rounded-full bg-blue shrink-0 mt-1.5" />}
                </div>
              </DropdownMenuItem>
            )
          })
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="w-full text-center text-sm text-purple cursor-pointer justify-center">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
