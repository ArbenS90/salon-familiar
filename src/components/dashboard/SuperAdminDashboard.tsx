import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { FichajeList } from '../fichajes/FichajeList'
import { UserList } from '../users/UserList'
import { UserForm } from '../users/UserForm'
import { RoleManager } from '../users/RoleManager'
import { useUsers } from '../../hooks/useUsers'
import { ExportButton } from '../export/ExportButton'
import { useFichajes } from '../../hooks/useFichajes'

export function SuperAdminDashboard() {
  const { user } = useAuth()
  const { fichajes } = useFichajes()
  const { createUser } = useUsers()
  const [showUserForm, setShowUserForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'fichajes' | 'users' | 'roles'>('fichajes')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Super Administrador</h1>
        <p className="text-gray-600 mt-2">Bienvenido, {user?.email}</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('fichajes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fichajes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Fichajes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gestión de Roles
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'fichajes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4">Exportar Fichajes</h2>
              <ExportButton fichajes={fichajes} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Todos los Fichajes</h2>
            <FichajeList canEdit={true} />
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Usuarios</h2>
            {!showUserForm && (
              <button
                onClick={() => setShowUserForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Crear Usuario
              </button>
            )}
          </div>
          {showUserForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <UserForm
                onSubmit={async (data) => {
                  await createUser(data)
                  setShowUserForm(false)
                }}
                onCancel={() => setShowUserForm(false)}
              />
            </div>
          )}
          <UserList canEdit={false} />
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="bg-white rounded-lg shadow p-6">
          <RoleManager />
        </div>
      )}
    </div>
  )
}

