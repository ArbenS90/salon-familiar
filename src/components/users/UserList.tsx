import { User } from '../../types/users'
import { useUsers } from '../../hooks/useUsers'

interface UserListProps {
  onEdit?: (user: User) => void
  canEdit?: boolean
}

export function UserList({ onEdit, canEdit = false }: UserListProps) {
  const { users, loading, error } = useUsers()

  if (loading) {
    return <div className="text-center py-8">Cargando usuarios...</div>
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  const roleLabels: Record<string, string> = {
    USER: 'Usuario',
    ADMIN: 'Administrador',
    SUPER_ADMIN: 'Super Administrador'
  }

  const roleColors: Record<string, string> = {
    USER: 'bg-gray-100 text-gray-800',
    ADMIN: 'bg-blue-100 text-blue-800',
    SUPER_ADMIN: 'bg-purple-100 text-purple-800'
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Usuarios</h3>
      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay usuarios registrados
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                {canEdit && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email || user.id.substring(0, 8) + '...'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${roleColors[user.profile?.role || 'USER']}`}>
                      {roleLabels[user.profile?.role || 'USER']}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.profile?.created_at 
                      ? new Date(user.profile.created_at).toLocaleDateString('es-ES')
                      : '-'}
                  </td>
                  {canEdit && onEdit && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => onEdit(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

