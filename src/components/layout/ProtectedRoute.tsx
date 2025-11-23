import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../types/auth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, loading, profile } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const hasRole = profile && roles.includes(profile.role)

    if (!hasRole) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}

