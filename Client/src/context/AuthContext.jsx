import { createContext, useState, useEffect } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)

/**
 * 🔐 AUTH PROVIDER
 * This is the SINGLE source of truth for the user's authentication state.
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const clearError = () => setError(null)

  /**
   * 🔄 REHYDRATION (App Load)
   * On mount, we check if an active session exists by calling /auth/me.
   */
  useEffect(() => {
    const rehydrate = async () => {
      // 🕵️ Check if we are already on a public auth page to avoid unnecessary calls
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register'
      
      const hasToken = localStorage.getItem('si_user')

      // Optimization: If no token and already on login page, don't even try the API
      if (!hasToken && isAuthPage) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.getMe()
        setUser(data)
      } catch (err) {
        // Silent fail is okay, it just means the session is dead
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    rehydrate()
  }, [])

  const register = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.registerInspector(formData)
      console.log("Data after Registration: ", data);
      localStorage.setItem('si_user', JSON.stringify({ accessToken: data.accessToken }))
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const login = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.loginInspector({ email, password })
      localStorage.setItem('si_user', JSON.stringify({ accessToken: data.accessToken }))
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid credentials'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.logoutInspector()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('si_user')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, clearError, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
