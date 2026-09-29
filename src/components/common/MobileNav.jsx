import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { Home, Search, ShoppingCart, Bell, User } from 'lucide-react'

const navItems = [
  { href: '/feed', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: 3 },
  { href: '/notifications', icon: Bell, label: 'Notifications', badge: 2 },
  { href: '/profile/me', icon: User, label: 'Profile' },
]

export default function MobileNav() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href || 
            (item.href === '/profile/me' && location.pathname.startsWith('/profile'))
          
          // Use user ID for profile link if available
          const href = item.href === '/profile/me' && user 
            ? `/profile/${user.id}` 
            : item.href

          return (
            <Link
              key={item.href}
              to={href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-1 relative transition-colors',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  )
}
