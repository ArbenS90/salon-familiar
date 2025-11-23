import { useState, useEffect } from 'react'
import { Fichaje, CreateFichajeDTO, UpdateFichajeDTO, FichajeTipo } from '../../types/fichajes'
import { formatDate } from '../../utils/dateUtils'

interface FichajeFormProps {
  fichaje?: Fichaje
  onSubmit: (data: CreateFichajeDTO | UpdateFichajeDTO) => Promise<void>
  onCancel: () => void
}

export function FichajeForm({ fichaje, onSubmit, onCancel }: FichajeFormProps) {
  const [tipo, setTipo] = useState<FichajeTipo>(fichaje?.tipo || 'ENTRADA')
  const [startedAt, setStartedAt] = useState(
    fichaje?.started_at 
      ? new Date(fichaje.started_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  )
  const [endedAt, setEndedAt] = useState(
    fichaje?.ended_at 
      ? new Date(fichaje.ended_at).toISOString().slice(0, 16)
      : ''
  )
  const [nota, setNota] = useState(fichaje?.nota || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = {
        tipo,
        started_at: new Date(startedAt).toISOString(),
        ended_at: endedAt ? new Date(endedAt).toISOString() : null,
        nota: nota || null
      }

      await onSubmit(data)
    } catch (err: any) {
      setError(err.message || 'Error al guardar fichaje')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
          Tipo
        </label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as FichajeTipo)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="ENTRADA">Entrada</option>
          <option value="SALIDA">Salida</option>
          <option value="PAUSA">Pausa</option>
          <option value="DESCANSO">Descanso</option>
        </select>
      </div>

      <div>
        <label htmlFor="startedAt" className="block text-sm font-medium text-gray-700">
          Fecha y Hora de Inicio
        </label>
        <input
          id="startedAt"
          type="datetime-local"
          value={startedAt}
          onChange={(e) => setStartedAt(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="endedAt" className="block text-sm font-medium text-gray-700">
          Fecha y Hora de Fin (opcional)
        </label>
        <input
          id="endedAt"
          type="datetime-local"
          value={endedAt}
          onChange={(e) => setEndedAt(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="nota" className="block text-sm font-medium text-gray-700">
          Nota (opcional)
        </label>
        <textarea
          id="nota"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : fichaje ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}

