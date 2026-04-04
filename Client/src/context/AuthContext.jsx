import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// ── Helpers ──────────────────────────────────────────────────────────────────
const getStoredUser  = () => JSON.parse(localStorage.getItem('si_user') || 'null')
const setStoredUser  = (user) => localStorage.setItem('si_user', JSON.stringify(user))
const clearStoredUser = () => localStorage.removeItem('si_user')

const getInspectors  = () => JSON.parse(localStorage.getItem('si_inspectors') || '[]')
const setInspectors  = (list) => localStorage.setItem('si_inspectors', JSON.stringify(list))

// Auto-generate Inspector ID: INS-2026-001
const generateInspectorId = () => {
  const year = new Date().getFullYear()
  const inspectors = getInspectors()
  const count = String(inspectors.length + 1).padStart(3, '0')
  return `INS-${year}-${count}`
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(getStoredUser)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const clearError = () => setError(null)

  // ── Register ──────────────────────────────────────────────────────────────
  const register = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 800)) // simulate network delay

      const inspectors = getInspectors()
      const exists = inspectors.find((i) => i.email === formData.email)
      if (exists) throw new Error('An account with this email already exists.')

      const newInspector = {
        id:           Date.now(),
        inspectorId:  generateInspectorId(),
        name:         formData.name,
        email:        formData.email,
        password:     formData.password, // NOTE: plain text for now (backend will hash)
        phone:        formData.phone || '',
        designation:  formData.designation || 'Field Inspector',
        region:       formData.region || '',
        role:         'inspector',
        createdAt:    new Date().toISOString(),
      }

      setInspectors([...inspectors, newInspector])

      const { password: _, ...safeUser } = newInspector
      setStoredUser(safeUser)
      setUser(safeUser)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 800))

      const inspectors = getInspectors()
      const found = inspectors.find((i) => i.email === email && i.password === password)
      if (!found) throw new Error('Invalid email or password.')

      const { password: _, ...safeUser } = found
      setStoredUser(safeUser)
      setUser(safeUser)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    clearStoredUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, clearError, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
