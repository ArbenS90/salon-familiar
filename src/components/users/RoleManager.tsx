import { useState } from 'react'
import { User } from '../../types/users'
import { UserRole } from '../../types/auth'
import { useUsers } from '../../hooks/useUsers'

export function RoleManager() {
  const { users, loading, error, updateUserRole } = useUsers()
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<UserRole>('USER')
  const [saving, setSaving] = useState(false)

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setNewRole(user.profile?.role || 'USER')
  }

  const handleSave = async () => {
    if (!editingUser) return

    setSaving(true)
    try {
      await updateUserRole(editingUser.id, { role: newRole })
      setEditingUser(null)
    } catch (err) {
      console.error('Error updating role:', err)
    } finally {
      setSaving(false)
    }
  }

  const roleLabels: Record<UserRole, string> = {
    USER: 'Usuario',
    ADMIN: 'Administrador',
    SUPER_ADMIN: 'Super Administrador'
  }

  if (loading) {
    return <div className="text-center py-8">Cargando usuarios...</div>
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Gestión de Roles</h3>
        <p className="text-sm text-gray-600 mb-4">
          Solo los Super Administradores pueden cambiar roles de usuarios.
        </p>
      </div>

      {editingUser && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-4">
          <h4 className="font-semibold mb-4">Editar Rol: {editingUser.email}</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Nuevo Rol
              </label>
              <select
                id="role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
                <option value="SUPER_ADMIN">Super Administrador</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol Actual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email || user.id.substring(0, 8) + '...'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                    {roleLabels[user.profile?.role || 'USER']}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Cambiar Rol
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

