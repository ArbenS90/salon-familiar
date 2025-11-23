import { supabase } from './supabaseClient'
import { Fichaje, CreateFichajeDTO, UpdateFichajeDTO } from '../types/fichajes'

export const fichajesService = {
  // Obtener todos los fichajes (según permisos RLS)
  async getAll(userId?: string) {
    let query = supabase
      .from('fichajes')
      .select('*')
      .order('started_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Fichaje[]
  },

  // Obtener fichaje por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('fichajes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Fichaje
  },

  // Crear nuevo fichaje
  async create(fichaje: CreateFichajeDTO) {
    // Validar que no haya SALIDA sin ENTRADA previa
    if (fichaje.tipo === 'SALIDA') {
      const { data: entradas } = await supabase
        .from('fichajes')
        .select('*')
        .eq('tipo', 'ENTRADA')
        .order('started_at', { ascending: false })
        .limit(1)

      if (!entradas || entradas.length === 0) {
        throw new Error('No se puede registrar SALIDA sin una ENTRADA previa')
      }
    }

    // Validar que PAUSA/DESCANSO tenga ENTRADA activa
    if (fichaje.tipo === 'PAUSA' || fichaje.tipo === 'DESCANSO') {
      const { data: entradas } = await supabase
        .from('fichajes')
        .select('*')
        .eq('tipo', 'ENTRADA')
        .order('started_at', { ascending: false })
        .limit(1)

      if (!entradas || entradas.length === 0) {
        throw new Error('No se puede registrar pausa/descanso sin una ENTRADA previa')
      }
    }

    const { data, error } = await supabase
      .from('fichajes')
      .insert({
        ...fichaje,
        started_at: fichaje.started_at || new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data as Fichaje
  },

  // Actualizar fichaje
  async update(id: string, updates: UpdateFichajeDTO) {
    const { data, error } = await supabase
      .from('fichajes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Fichaje
  },

  // Eliminar fichaje
  async delete(id: string) {
    const { error } = await supabase
      .from('fichajes')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Obtener fichajes por rango de fechas
  async getByDateRange(startDate: string, endDate: string, userId?: string) {
    let query = supabase
      .from('fichajes')
      .select('*')
      .gte('started_at', startDate)
      .lte('started_at', endDate)
      .order('started_at', { ascending: true })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Fichaje[]
  }
}

