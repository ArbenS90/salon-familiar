import { useState } from 'react'
import { Fichaje } from '../../types/fichajes'
import { exportService } from '../../services/exportService'
import { getStartOfMonth, getEndOfMonth, getStartOfWeek, getEndOfWeek, getStartOfDay, getEndOfDay } from '../../utils/dateUtils'

interface ExportButtonProps {
  fichajes: Fichaje[]
  userId?: string
}

export function ExportButton({ fichajes, userId }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showDateRange, setShowDateRange] = useState(false)
  const [startDate, setStartDate] = useState(getStartOfMonth())
  const [endDate, setEndDate] = useState(getEndOfMonth())

  const handleExportAll = async () => {
    setLoading(true)
    try {
      await exportService.exportToXLSX(fichajes)
    } catch (error) {
      console.error('Error exporting:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportDateRange = async () => {
    setLoading(true)
    try {
      const filtered = fichajes.filter(f => {
        const fecha = new Date(f.started_at)
        return fecha >= new Date(startDate) && fecha <= new Date(endDate)
      })
      await exportService.exportByDateRange(filtered, startDate, endDate, userId)
      setShowDateRange(false)
    } catch (error) {
      console.error('Error exporting:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickExport = (period: 'day' | 'week' | 'month') => {
    let start: string
    let end: string

    switch (period) {
      case 'day':
        start = getStartOfDay()
        end = getEndOfDay()
        break
      case 'week':
        start = getStartOfWeek()
        end = getEndOfWeek()
        break
      case 'month':
        start = getStartOfMonth()
        end = getEndOfMonth()
        break
    }

    setStartDate(start)
    setEndDate(end)
    setShowDateRange(true)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleExportAll}
          disabled={loading || fichajes.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
        >
          {loading ? 'Exportando...' : 'Exportar Todo'}
        </button>
        <button
          onClick={() => handleQuickExport('day')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          Exportar Hoy
        </button>
        <button
          onClick={() => handleQuickExport('week')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          Exportar Semana
        </button>
        <button
          onClick={() => handleQuickExport('month')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          Exportar Mes
        </button>
        <button
          onClick={() => setShowDateRange(!showDateRange)}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm"
        >
          Rango Personalizado
        </button>
      </div>

      {showDateRange && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Fecha Inicio
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate.split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value).toISOString())}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                Fecha Fin
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate.split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value).toISOString())}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportDateRange}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {loading ? 'Exportando...' : 'Exportar'}
              </button>
              <button
                onClick={() => setShowDateRange(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

