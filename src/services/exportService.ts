import * as XLSX from 'xlsx'
import { Fichaje } from '../types/fichajes'
import { formatDate, formatTime } from '../utils/dateUtils'

export const exportService = {
  // Exportar fichajes a XLSX
  async exportToXLSX(fichajes: Fichaje[], filename: string = 'fichajes.xlsx') {
    // Preparar datos para exportación
    const data = fichajes.map((fichaje) => ({
      'Tipo': fichaje.tipo,
      'Fecha Inicio': formatDate(fichaje.started_at),
      'Hora Inicio': formatTime(fichaje.started_at),
      'Fecha Fin': fichaje.ended_at ? formatDate(fichaje.ended_at) : '',
      'Hora Fin': fichaje.ended_at ? formatTime(fichaje.ended_at) : '',
      'Nota': fichaje.nota || '',
      'Creado': formatDate(fichaje.created_at)
    }))

    // Crear workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 12 }, // Tipo
      { wch: 18 }, // Fecha Inicio
      { wch: 12 }, // Hora Inicio
      { wch: 18 }, // Fecha Fin
      { wch: 12 }, // Hora Fin
      { wch: 30 }, // Nota
      { wch: 18 }  // Creado
    ]
    ws['!cols'] = colWidths

    // Agregar hoja al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Fichajes')

    // Descargar archivo
    XLSX.writeFile(wb, filename)
  },

  // Exportar fichajes por rango de fechas
  async exportByDateRange(
    fichajes: Fichaje[],
    startDate: string,
    endDate: string,
    userId?: string
  ) {
    const start = new Date(startDate).toLocaleDateString('es-ES')
    const end = new Date(endDate).toLocaleDateString('es-ES')
    const filename = userId 
      ? `fichajes_${start}_${end}.xlsx`
      : `fichajes_todos_${start}_${end}.xlsx`

    await this.exportToXLSX(fichajes, filename)
  }
}

