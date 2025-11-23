import { useState } from 'react'
import { Fichaje } from '../../types/fichajes'
import { FichajeCard } from './FichajeCard'
import { FichajeForm } from './FichajeForm'
import { useFichajes } from '../../hooks/useFichajes'

interface FichajeListProps {
  userId?: string
  canEdit?: boolean
}

export function FichajeList({ userId, canEdit = true }: FichajeListProps) {
  const { fichajes, loading, error, createFichaje, updateFichaje, deleteFichaje } = useFichajes(userId)
  const [editingFichaje, setEditingFichaje] = useState<Fichaje | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async (data: any) => {
    await createFichaje(data)
    setShowForm(false)
  }

  const handleUpdate = async (data: any) => {
    if (editingFichaje) {
      await updateFichaje(editingFichaje.id, data)
      setEditingFichaje(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este fichaje?')) {
      await deleteFichaje(id)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando fichajes...</div>
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Fichajes</h3>
          {!showForm && !editingFichaje && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Nuevo Fichaje
            </button>
          )}
        </div>
      )}

      {showForm && !editingFichaje && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h4 className="text-lg font-semibold mb-4">Nuevo Fichaje</h4>
          <FichajeForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingFichaje && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h4 className="text-lg font-semibold mb-4">Editar Fichaje</h4>
          <FichajeForm
            fichaje={editingFichaje}
            onSubmit={handleUpdate}
            onCancel={() => setEditingFichaje(null)}
          />
        </div>
      )}

      {fichajes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay fichajes registrados
        </div>
      ) : (
        <div className="space-y-3">
          {fichajes.map((fichaje) => (
            <FichajeCard
              key={fichaje.id}
              fichaje={fichaje}
              onEdit={canEdit ? (f) => {
                setEditingFichaje(f)
                setShowForm(false)
              } : undefined}
              onDelete={canEdit ? handleDelete : undefined}
              canEdit={canEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

