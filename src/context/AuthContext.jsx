import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Demo users for different roles
const DEMO_USERS = {
  buyer: {
    id: '1',
    name: 'Alex Johnson',
    email: 'buyer@demo.com',
    role: 'BUYER',
    avatar: null,
    bio: 'Love finding great deals!',
    followers: 234,
    following: 156,
    posts: 12,
  },
  seller: {
    id: '2',
    name: 'Sarah Chen',
    email: 'seller@demo.com',
    role: 'SELLER',
    avatar: null,
    bio: 'Premium quality products at great prices',
    storeName: 'Chen\'s Boutique',
    followers: 1520,
    following: 89,
    posts: 45,
  },
  admin: {
    id: '3',
    name: 'Admin User',
    email: 'admin@demo.com',
    role: 'ADMIN',
    avatar: null,
    bio: 'Platform Administrator',
    followers: 0,
    following: 0,
    posts: 0,
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for saved auth
    const savedUser = localStorage.getItem('socialshop_user')
    const savedToken = localStorage.getItem('socialshop_token')
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setAccessToken(savedToken)
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    // Demo login - match email to demo users
    const demoKey = Object.keys(DEMO_USERS).find(
      key => DEMO_USERS[key].email === email
    )
    
    if (demoKey) {
      const demoUser = DEMO_USERS[demoKey]
      const token = `demo_token_${demoKey}_${Date.now()}`
      
      setUser(demoUser)
      setAccessToken(token)
      localStorage.setItem('socialshop_user', JSON.stringify(demoUser))
      localStorage.setItem('socialshop_token', token)
      
      return { success: true, user: demoUser }
    }
    
    // For any other email, create a buyer account
    const newUser = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role: 'BUYER',
      avatar: null,
      bio: '',
      followers: 0,
      following: 0,
      posts: 0,
    }
    
    const token = `token_${Date.now()}`
    setUser(newUser)
    setAccessToken(token)
    localStorage.setItem('socialshop_user', JSON.stringify(newUser))
    localStorage.setItem('socialshop_token', token)
    
    return { success: true, user: newUser }
  }

  const register = async (name, email, password, role) => {
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: role || 'BUYER',
      avatar: null,
      bio: '',
      followers: 0,
      following: 0,
      posts: 0,
      ...(role === 'SELLER' && { storeName: `${name}'s Store` }),
    }
    
    const token = `token_${Date.now()}`
    setUser(newUser)
    setAccessToken(token)
    localStorage.setItem('socialshop_user', JSON.stringify(newUser))
    localStorage.setItem('socialshop_token', token)
    
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem('socialshop_user')
    localStorage.removeItem('socialshop_token')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('socialshop_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading,
    role: user?.role || null,
    login,
    register,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
