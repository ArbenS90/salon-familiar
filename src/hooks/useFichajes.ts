import { useState, useEffect } from 'react'
import { fichajesService } from '../services/fichajesService'
import { Fichaje, CreateFichajeDTO, UpdateFichajeDTO } from '../types/fichajes'

export function useFichajes(userId?: string) {
  const [fichajes, setFichajes] = useState<Fichaje[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFichajes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fichajesService.getAll(userId)
      setFichajes(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFichajes()
  }, [userId])

  const createFichaje = async (fichaje: CreateFichajeDTO) => {
    try {
      const newFichaje = await fichajesService.create(fichaje)
      setFichajes([newFichaje, ...fichajes])
      return newFichaje
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateFichaje = async (id: string, updates: UpdateFichajeDTO) => {
    try {
      const updated = await fichajesService.update(id, updates)
      setFichajes(fichajes.map(f => f.id === id ? updated : f))
      return updated
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteFichaje = async (id: string) => {
    try {
      await fichajesService.delete(id)
      setFichajes(fichajes.filter(f => f.id !== id))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    fichajes,
    loading,
    error,
    createFichaje,
    updateFichaje,
    deleteFichaje,
    refresh: loadFichajes
  }
}

