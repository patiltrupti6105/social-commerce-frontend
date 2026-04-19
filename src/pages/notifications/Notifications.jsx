import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, MessageCircle, UserPlus, Package, CheckCheck, Bell } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { useNotifications } from '@/context/NotificationContext'
import { notificationApi } from '@/api/notificationApi'

const notificationIcons = { LIKE: Heart, COMMENT: MessageCircle, FOLLOW: UserPlus, ORDER_PLACED: Package }
const notificationColors = { LIKE: 'bg-red-100 text-red-500', COMMENT: 'bg-blue/10 text-blue', FOLLOW: 'bg-purple/10 text-purple', ORDER_PLACED: 'bg-orange/10 text-orange' }

export default function Notifications() {
  const { notifications, setNotifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isLoading, setIsLoading] = useState(notifications.length === 0)

  useEffect(() => {
    if (notifications.length === 0) {
      notificationApi.getNotifications()
        .then(r => setNotifications(r.data.data?.content || r.data.data || []))
        .catch(() => {})
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const unread = notifications.filter(n => !n.read && !n.isRead)
  const all = notifications

  const NotifItem = ({ notif }) => {
    const Icon = notificationIcons[notif.type] || Bell
    const colorClass = notificationColors[notif.type] || 'bg-muted text-muted-foreground'
    return (
      <div
        className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors hover:bg-accent ${!notif.read ? 'bg-accent/30' : ''}`}
        onClick={() => !notif.read && markAsRead(notif.id)}
      >
        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm">{notif.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(notif.createdAt || notif.timestamp)}</p>
        </div>
        {!notif.read && <div className="w-2 h-2 rounded-full bg-blue shrink-0 mt-2" />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-muted-foreground">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>
        <Tabs defaultValue="all">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread {unreadCount > 0 && <span className="ml-1 text-xs bg-blue text-white rounded-full px-1.5">{unreadCount}</span>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardContent className="p-2">
                {isLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading...</div>
                ) : all.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">{all.map(n => <NotifItem key={n.id} notif={n} />)}</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="unread">
            <Card>
              <CardContent className="p-2">
                {unread.length === 0 ? (
                  <div className="py-12 text-center">
                    <CheckCheck className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">All caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-1">{unread.map(n => <NotifItem key={n.id} notif={n} />)}</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
