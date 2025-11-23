export type FichajeTipo = 'ENTRADA' | 'SALIDA' | 'PAUSA' | 'DESCANSO'

export interface Fichaje {
  id: string
  user_id: string
  tipo: FichajeTipo
  started_at: string
  ended_at: string | null
  nota: string | null
  created_at: string
  updated_at: string
}

export interface CreateFichajeDTO {
  tipo: FichajeTipo
  started_at?: string
  ended_at?: string | null
  nota?: string | null
}

export interface UpdateFichajeDTO {
  tipo?: FichajeTipo
  started_at?: string
  ended_at?: string | null
  nota?: string | null
}

export interface HoursCalculation {
  user_id: string
  fecha_inicio: string
  fecha_fin: string
  periodo: 'dia' | 'semana' | 'mes'
  total_horas: number
  horas_formateadas: string
  desglose: Record<string, number>
}

