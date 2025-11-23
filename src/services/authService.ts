import { supabase } from './supabaseClient'
import { Profile, UserRole } from '../types/auth'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  role?: UserRole
}

export const authService = {
  // Iniciar sesión
  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error) throw error

    // Obtener perfil del usuario
    if (data.user) {
      const profile = await this.getProfile(data.user.id)
      return { user: data.user, profile }
    }

    return { user: data.user, profile: null }
  },

  // Registrar nuevo usuario (solo ADMIN/SUPER_ADMIN)
  async register(data: RegisterData) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    })

    if (error) throw error

    // Crear perfil con rol (si se proporciona)
    if (authData.user && data.role) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          role: data.role
        })

      if (profileError) throw profileError
    }

    return authData
  },

  // Cerrar sesión
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Obtener perfil del usuario
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No encontrado
      throw error
    }

    return data
  },

  // Obtener sesión actual
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

