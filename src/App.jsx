import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Common Components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import MobileNav from './components/common/MobileNav'
import PrivateRoute from './components/common/PrivateRoute'
import RoleRoute from './components/common/RoleRoute'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Profile Pages
import Profile from './pages/profile/Profile'
import EditProfile from './pages/profile/EditProfile'

// Feed Pages
import Feed from './pages/feed/Feed'
import Explore from './pages/feed/Explore'

// Post Pages
import PostDetail from './pages/posts/PostDetail'
import CreatePost from './pages/posts/CreatePost'

// Notifications
import Notifications from './pages/notifications/Notifications'

// Product Pages
import ProductList from './pages/products/ProductList'
import ProductDetail from './pages/products/ProductDetail'

// Cart Pages
import Cart from './pages/cart/Cart'
import Checkout from './pages/cart/Checkout'

// Order Pages
import OrderHistory from './pages/orders/OrderHistory'
import OrderDetail from './pages/orders/OrderDetail'

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard'
import CreateProduct from './pages/seller/CreateProduct'
import SellerOrders from './pages/seller/SellerOrders'

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProducts from './pages/admin/AdminProducts'
import AdminPosts from './pages/admin/AdminPosts'
import Analytics from './pages/admin/Analytics'

function AppLayout({ children, showNav = true }) {
  const { isAuthenticated } = useAuth()
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showNav && <Navbar />}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      {showNav && <Footer />}
      {isAuthenticated && <MobileNav />}
    </div>
  )
}

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Public Product Routes */}
      <Route path="/products" element={
        <AppLayout>
          <ProductList />
        </AppLayout>
      } />
      <Route path="/products/:id" element={
        <AppLayout>
          <ProductDetail />
        </AppLayout>
      } />
      <Route path="/explore" element={
        <AppLayout>
          <Explore />
        </AppLayout>
      } />

      {/* Protected Routes */}
      <Route path="/feed" element={
        <PrivateRoute>
          <AppLayout>
            <Feed />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/notifications" element={
        <PrivateRoute>
          <AppLayout>
            <Notifications />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/posts/:id" element={
        <PrivateRoute>
          <AppLayout>
            <PostDetail />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/posts/create" element={
        <PrivateRoute>
          <AppLayout>
            <CreatePost />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/cart" element={
        <PrivateRoute>
          <AppLayout>
            <Cart />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/checkout" element={
        <PrivateRoute>
          <AppLayout>
            <Checkout />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/orders" element={
        <PrivateRoute>
          <AppLayout>
            <OrderHistory />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/orders/:id" element={
        <PrivateRoute>
          <AppLayout>
            <OrderDetail />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/profile/:id" element={
        <PrivateRoute>
          <AppLayout>
            <Profile />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/profile/me" element={
        <PrivateRoute>
          <AppLayout>
            <EditProfile />
          </AppLayout>
        </PrivateRoute>
      } />

      {/* Seller Routes */}
      <Route path="/seller/dashboard" element={
        <RoleRoute allowedRoles={['SELLER', 'ADMIN']}>
          <AppLayout>
            <SellerDashboard />
          </AppLayout>
        </RoleRoute>
      } />
      
      <Route path="/seller/products/create" element={
        <RoleRoute allowedRoles={['SELLER', 'ADMIN']}>
          <AppLayout>
            <CreateProduct />
          </AppLayout>
        </RoleRoute>
      } />
      
      <Route path="/seller/orders" element={
        <RoleRoute allowedRoles={['SELLER', 'ADMIN']}>
          <AppLayout>
            <SellerOrders />
          </AppLayout>
        </RoleRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <RoleRoute allowedRoles={['ADMIN']}>
          <AdminLayout />
        </RoleRoute>
      }>
        <Route index element={<Navigate to="/admin/analytics" replace />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* 403 Forbidden */}
      <Route path="/403" element={
        <AppLayout showNav={false}>
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-4xl font-bold">403</h1>
            <p className="text-muted-foreground">You don&apos;t have permission to access this page.</p>
          </div>
        </AppLayout>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  )
}

export default App
