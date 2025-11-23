import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const { user, profile, logout, isAdmin, isSuperAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const roleLabels: Record<string, string> = {
    USER: 'Usuario',
    ADMIN: 'Administrador',
    SUPER_ADMIN: 'Super Administrador'
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Control Horario</h1>
            {user && (
              <nav className="flex gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </button>
                {isAdmin() && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Administración
                  </button>
                )}
              </nav>
            )}
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{user.email}</span>
                  {profile && (
                    <span className="ml-2 text-gray-500">
                      ({roleLabels[profile.role]})
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

