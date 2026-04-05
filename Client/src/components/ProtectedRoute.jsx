import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d1b2a]">
        <div className="w-12 h-12 border-4 border-[#3a5a40] border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login and remember where they were going
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
