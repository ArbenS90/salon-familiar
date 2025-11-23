import { Fichaje, FichajeTipo } from '../../types/fichajes'
import { formatDate, formatTime } from '../../utils/dateUtils'

interface FichajeCardProps {
  fichaje: Fichaje
  onEdit?: (fichaje: Fichaje) => void
  onDelete?: (id: string) => void
  canEdit?: boolean
}

const tipoColors: Record<FichajeTipo, string> = {
  ENTRADA: 'bg-green-100 text-green-800',
  SALIDA: 'bg-red-100 text-red-800',
  PAUSA: 'bg-yellow-100 text-yellow-800',
  DESCANSO: 'bg-blue-100 text-blue-800'
}

const tipoLabels: Record<FichajeTipo, string> = {
  ENTRADA: 'Entrada',
  SALIDA: 'Salida',
  PAUSA: 'Pausa',
  DESCANSO: 'Descanso'
}

export function FichajeCard({ fichaje, onEdit, onDelete, canEdit = true }: FichajeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${tipoColors[fichaje.tipo]}`}>
              {tipoLabels[fichaje.tipo]}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(fichaje.started_at)}
            </span>
          </div>
          <div className="text-sm text-gray-700">
            <p><strong>Inicio:</strong> {formatTime(fichaje.started_at)}</p>
            {fichaje.ended_at && (
              <p><strong>Fin:</strong> {formatTime(fichaje.ended_at)}</p>
            )}
            {fichaje.nota && (
              <p className="mt-2 text-gray-600">{fichaje.nota}</p>
            )}
          </div>
        </div>
        {canEdit && (onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(fichaje)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(fichaje.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

