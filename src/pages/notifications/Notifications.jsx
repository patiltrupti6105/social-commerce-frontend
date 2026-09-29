import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, MessageCircle, UserPlus, Package, CheckCheck, Bell, Loader2 } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { useNotifications } from '@/context/NotificationContext'
import { notificationApi } from '@/api/notificationApi'

const notificationIcons = {
  LIKE: Heart,
  COMMENT: MessageCircle,
  FOLLOW: UserPlus,
  ORDER_PLACED: Package,
}
const notificationColors = {
  LIKE: 'bg-red-100 text-red-500',
  COMMENT: 'bg-blue-100 text-blue-600',
  FOLLOW: 'bg-purple-100 text-purple-600',
  ORDER_PLACED: 'bg-orange-100 text-orange-600',
}

export default function Notifications() {
  const { notifications, setNotifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications()

  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadPage = useCallback(async (pageNum, replace = false) => {
    try {
      const r = await notificationApi.getNotifications(pageNum)
      const payload = r.data.data
      // Handle both paginated {content, totalPages} and plain array
      const items = Array.isArray(payload) ? payload : (payload?.content ?? [])
      const last = Array.isArray(payload) ? true : payload?.last ?? true

      setNotifications(prev => replace ? items : [...prev, ...items])
      setHasMore(!last)
    } catch {
      toast.error('Could not load notifications')
    }
  }, [setNotifications])

  useEffect(() => {
    setIsLoading(true)
    loadPage(0, true).finally(() => setIsLoading(false))
  }, [])

  const loadMore = async () => {
    setLoadingMore(true)
    const next = page + 1
    await loadPage(next)
    setPage(next)
    setLoadingMore(false)
  }

  const unread = notifications.filter(n => !n.read && !n.isRead)

  const NotifItem = ({ notif }) => {
    const Icon = notificationIcons[notif.type] || Bell
    const colorClass = notificationColors[notif.type] || 'bg-muted text-muted-foreground'
    return (
      <div
        className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
          !notif.read && !notif.isRead ? 'bg-accent/30' : ''
        }`}
        onClick={() => !notif.read && markAsRead(notif.id)}
      >
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm">{notif.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatRelativeTime(notif.createdAt || notif.timestamp)}
          </p>
        </div>
        {!notif.read && !notif.isRead && (
          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
        )}
      </div>
    )
  }

  const LoadMoreButton = () =>
    hasMore ? (
      <div className="pt-4 text-center">
        <Button variant="ghost" size="sm" onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Load more
        </Button>
      </div>
    ) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-muted-foreground"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread{' '}
              {unreadCount > 0 && (
                <span className="ml-1 text-xs bg-blue-500 text-white rounded-full px-1.5">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-2">
                {isLoading ? (
                  <div className="py-8 text-center text-muted-foreground flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      {notifications.map(n => (
                        <NotifItem key={n.id} notif={n} />
                      ))}
                    </div>
                    <LoadMoreButton />
                  </>
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
                  <div className="space-y-1">
                    {unread.map(n => (
                      <NotifItem key={n.id} notif={n} />
                    ))}
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
