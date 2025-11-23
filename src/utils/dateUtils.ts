// Utilidades para manejo de fechas

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDateOnly(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function formatTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getStartOfDay(date: Date = new Date()): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function getEndOfDay(date: Date = new Date()): string {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d.toISOString()
}

export function getStartOfWeek(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Lunes
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function getEndOfWeek(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? 0 : 7) // Domingo
  d.setDate(diff)
  d.setHours(23, 59, 59, 999)
  return d.toISOString()
}

export function getStartOfMonth(date: Date = new Date()): string {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function getEndOfMonth(date: Date = new Date()): string {
  const d = new Date(date)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  d.setHours(23, 59, 59, 999)
  return d.toISOString()
}

