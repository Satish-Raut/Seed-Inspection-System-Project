import { createContext, useState, useEffect } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)

/**
 * 🔐 AUTH PROVIDER
 * This is the SINGLE source of truth for the user's authentication state.
 * 
 * Two separate loading flags:
 *  - initializing: true only during the startup /auth/me rehydration check
 *  - loading:      true only when the user actively clicks Login or Register
 */
export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null)
  const [initializing, setInitializing] = useState(true)  // startup check
  const [loading, setLoading]       = useState(false)      // user action only
  const [error, setError]           = useState(null)

  const clearError = () => setError(null)

  /**
   * 🔄 REHYDRATION (App Load)
   * On mount, check if an active session exists by calling /auth/me.
   * Uses `initializing` — NOT `loading` — so login/register buttons
   * are never affected by this background check.
   */
  useEffect(() => {
    const rehydrate = async () => {
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register'
      const hasToken   = localStorage.getItem('si_user')

      // No token + on auth page → nothing to rehydrate, skip the API call
      if (!hasToken && isAuthPage) {
        setInitializing(false)
        return
      }

      // Has token → verify it's still valid with the server
      if (hasToken) {
        try {
          const { data } = await api.getMe()
          setUser(data)
        } catch {
          // Session expired or invalid — silently clear it
          localStorage.removeItem('si_user')
          setUser(null)
        }
      }

      setInitializing(false)
    }
    rehydrate()
  }, [])

  const register = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.registerInspector(formData)
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

  // While rehydrating on first load, show a minimal full-screen loader
  // so pages don't flash an empty/broken state
  if (initializing) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted text-sm font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, clearError, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
