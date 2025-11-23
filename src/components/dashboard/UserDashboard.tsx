import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { FichajeList } from '../fichajes/FichajeList'
import { ExportButton } from '../export/ExportButton'
import { useFichajes } from '../../hooks/useFichajes'
import { useHours } from '../../hooks/useHours'
import { getStartOfDay, getEndOfDay, getStartOfWeek, getEndOfWeek, getStartOfMonth, getEndOfMonth } from '../../utils/dateUtils'

export function UserDashboard() {
  const { user, profile } = useAuth()
  const { fichajes } = useFichajes(user?.id)
  const { calculateHours, loading: hoursLoading } = useHours()
  const [hoursData, setHoursData] = useState<any>(null)
  const [period, setPeriod] = useState<'dia' | 'semana' | 'mes'>('dia')

  const handleCalculateHours = async () => {
    if (!user) return

    let start: string
    let end: string

    switch (period) {
      case 'dia':
        start = getStartOfDay()
        end = getEndOfDay()
        break
      case 'semana':
        start = getStartOfWeek()
        end = getEndOfWeek()
        break
      case 'mes':
        start = getStartOfMonth()
        end = getEndOfMonth()
        break
    }

    try {
      const result = await calculateHours(start, end, period, user.id)
      setHoursData(result)
    } catch (error) {
      console.error('Error calculating hours:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Calcular Horas</h3>
          <div className="space-y-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'dia' | 'semana' | 'mes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="dia">Día</option>
              <option value="semana">Semana</option>
              <option value="mes">Mes</option>
            </select>
            <button
              onClick={handleCalculateHours}
              disabled={hoursLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {hoursLoading ? 'Calculando...' : 'Calcular'}
            </button>
            {hoursData && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="font-semibold">Total: {hoursData.horas_formateadas}</p>
                <p className="text-sm text-gray-600">{hoursData.total_horas} horas</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Exportar</h3>
          <ExportButton fichajes={fichajes} userId={user?.id} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <FichajeList userId={user?.id} canEdit={true} />
      </div>
    </div>
  )
}

