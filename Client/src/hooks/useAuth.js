import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * useAuth 
 * Custom hook to consume the AuthContext within components.
 * Provides access to current user, loading states, and auth functions.
 * @returns {Object} - { user, loading, error, register, login, logout }
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  const { user, loading, error, register, login, logout, clearError } = context

  return {
    user,           // Current logged-in user object { name, id, token, ... }
    loading,        // Boolean: true when an auth operation is in progress
    error,          // String: holds current error message if login/register fails
    register,       // Function: register(formData) -> registers a new account
    login,          // Function: login({ email, password }) -> logs in existing inspector
    logout,         // Function: logout() -> clears local session and token
    clearError      // Function: clearError() -> resets the error state
  }
}
