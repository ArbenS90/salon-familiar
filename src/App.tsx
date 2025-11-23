import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/layout/Header'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import { UserDashboard } from './components/dashboard/UserDashboard'
import { AdminDashboard } from './components/dashboard/AdminDashboard'
import { SuperAdminDashboard } from './components/dashboard/SuperAdminDashboard'

function App() {
  const { isAuthenticated, loading, profile } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      {isAuthenticated && <Header />}
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {profile?.role === 'SUPER_ADMIN' ? (
                <SuperAdminDashboard />
              ) : profile?.role === 'ADMIN' ? (
                <AdminDashboard />
              ) : (
                <UserDashboard />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
              {profile?.role === 'SUPER_ADMIN' ? (
                <SuperAdminDashboard />
              ) : (
                <AdminDashboard />
              )}
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

