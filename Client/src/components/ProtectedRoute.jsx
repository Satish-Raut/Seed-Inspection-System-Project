import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Redirect to login and remember where they were going
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
