import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/api/axiosConfig'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('socialshop_user')
    const savedToken = localStorage.getItem('socialshop_token')
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setAccessToken(savedToken)
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { accessToken, refreshToken, user } = res.data.data
    // Backend UserDTO uses 'uuid' as the id field
    const normalizedUser = { ...user, id: user.uuid }
    localStorage.setItem('socialshop_token', accessToken)
    localStorage.setItem('socialshop_refresh_token', refreshToken)
    localStorage.setItem('socialshop_user', JSON.stringify(normalizedUser))
    setUser(normalizedUser)
    setAccessToken(accessToken)
    return { success: true, user: normalizedUser }
  }

  const register = async (name, email, password, role) => {
    // Backend register returns UserDTO only (no tokens) — so we register then login
    await api.post('/auth/register', { name, email, password, role })
    return login(email, password)
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch (_) {}
    localStorage.clear()
    setUser(null)
    setAccessToken(null)
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('socialshop_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{
      user, accessToken, isAuthenticated: !!user, isLoading,
      role: user?.role || null, login, register, logout, updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export default AuthContext
