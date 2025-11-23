import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { authService } from '../services/authService'
import { Profile } from '../types/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar usuario actual al montar
    loadUser()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const userProfile = await authService.getProfile(session.user.id)
          setProfile(userProfile)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const userProfile = await authService.getProfile(currentUser.id)
        setProfile(userProfile)
      }
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const { user: loggedUser, profile: userProfile } = await authService.login({ email, password })
    setUser(loggedUser)
    setProfile(userProfile)
    return { user: loggedUser, profile: userProfile }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = () => profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN'
  const isSuperAdmin = () => profile?.role === 'SUPER_ADMIN'

  return {
    user,
    profile,
    loading,
    login,
    logout,
    isAdmin,
    isSuperAdmin,
    isAuthenticated: !!user
  }
}

