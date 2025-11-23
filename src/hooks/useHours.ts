import { useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { HoursCalculation } from '../types/fichajes'

export function useHours() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateHours = async (
    fechaInicio: string,
    fechaFin: string,
    periodo: 'dia' | 'semana' | 'mes',
    userId?: string
  ): Promise<HoursCalculation> => {
    setLoading(true)
    setError(null)

    try {
      // Obtener token de sesión
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No hay sesión activa')
      }

      // Llamar a la Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('calculate-hours', {
        body: {
          user_id: userId,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          periodo
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (functionError) throw functionError
      if (!data) throw new Error('No se recibieron datos')

      return data as HoursCalculation
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    calculateHours,
    loading,
    error
  }
}

