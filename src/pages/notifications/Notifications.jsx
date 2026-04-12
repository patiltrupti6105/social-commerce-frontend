import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, MessageCircle, UserPlus, Package, CheckCheck, Bell } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

// Demo notifications
const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    type: 'LIKE',
    user: { id: '3', name: 'John Doe', avatar: null },
    message: 'liked your post',
    postId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'COMMENT',
    user: { id: '4', name: 'Sarah Wilson', avatar: null },
    message: 'commented on your post: "Great product!"',
    postId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: 'FOLLOW',
    user: { id: '5', name: 'Mike Brown', avatar: null },
    message: 'started following you',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: '4',
    type: 'ORDER_PLACED',
    orderId: '1234',
    message: 'Your order #1234 has been confirmed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: '5',
    type: 'LIKE',
    user: { id: '6', name: 'Emma Davis', avatar: null },
    message: 'liked your product listing',
    productId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
  },
  {
    id: '6',
    type: 'COMMENT',
    user: { id: '7', name: 'Tom Harris', avatar: null },
    message: 'replied to your comment: "Thanks for the recommendation!"',
    postId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    read: true,
  },
  {
    id: '7',
    type: 'ORDER_PLACED',
    orderId: '1233',
    message: 'Your order #1233 has been shipped',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    read: true,
  },
  {
    id: '8',
    type: 'FOLLOW',
    user: { id: '8', name: 'Lisa Park', avatar: null },
    message: 'started following you',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
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
  LIKE: 'bg-red-500/10 text-red-500',
  COMMENT: 'bg-green/10 text-green',
  FOLLOW: 'bg-blue/10 text-blue',
  ORDER_PLACED: 'bg-orange/10 text-orange',
}

function NotificationItem({ notification, onRead }) {
  const Icon = notificationIcons[notification.type] || Bell
  const colorClass = notificationColors[notification.type] || 'bg-muted text-muted-foreground'

  const getLink = () => {
    if (notification.postId) return `/posts/${notification.postId}`
    if (notification.productId) return `/products/${notification.productId}`
    if (notification.orderId) return `/orders/${notification.orderId}`
    if (notification.user?.id) return `/profile/${notification.user.id}`
    return '#'
  }

  return (
    <Link to={getLink()} onClick={() => onRead(notification.id)}>
      <div className={`flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-accent ${!notification.read ? 'bg-green/5' : ''}`}>
        {/* User Avatar or Icon */}
        {notification.user ? (
          <Avatar className="h-12 w-12">
            <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
            <AvatarFallback className={colorClass}>
              {notification.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            {notification.user && (
              <span className="font-semibold mr-1">{notification.user.name}</span>
            )}
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatRelativeTime(notification.timestamp)}
          </p>
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div className="h-2 w-2 rounded-full bg-green shrink-0 mt-2" />
        )}
      </div>
    </Link>
  )
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read
    if (activeTab === 'likes') return n.type === 'LIKE'
    if (activeTab === 'comments') return n.type === 'COMMENT'
    if (activeTab === 'orders') return n.type === 'ORDER_PLACED'
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-green border-green/20 hover:bg-green/10"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6 overflow-x-auto">
            <TabsTrigger 
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green data-[state=active]:bg-transparent"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green data-[state=active]:bg-transparent"
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-green text-green-foreground text-xs">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="likes"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green data-[state=active]:bg-transparent"
            >
              Likes
            </TabsTrigger>
            <TabsTrigger 
              value="comments"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green data-[state=active]:bg-transparent"
            >
              Comments
            </TabsTrigger>
            <TabsTrigger 
              value="orders"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green data-[state=active]:bg-transparent"
            >
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <Card className="border-green/10">
              <CardContent className="p-0 divide-y">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                    />
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
