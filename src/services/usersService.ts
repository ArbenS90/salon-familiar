import { supabase } from './supabaseClient'
import { User, CreateUserDTO, UpdateUserRoleDTO } from '../types/users'

export const usersService = {
  // Obtener todos los usuarios (solo ADMIN/SUPER_ADMIN)
  async getAll() {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Obtener email del usuario actual para referencia
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    // Mapear a formato User
    const users: User[] = (profiles || []).map((profile: any) => ({
      id: profile.user_id,
      email: profile.user_id === currentUser?.id ? currentUser?.email : undefined,
      profile: {
        id: profile.id,
        user_id: profile.user_id,
        role: profile.role,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
    }))

    return users
  },

  // Obtener usuario por ID
  async getById(userId: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error

    // Obtener email solo si es el usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    const email = user?.id === userId ? user.email : undefined

    return {
      id: userId,
      email,
      profile: {
        id: profile.id,
        user_id: profile.user_id,
        role: profile.role,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
    } as User
  },

  // Crear nuevo usuario (solo ADMIN/SUPER_ADMIN)
  async create(userData: CreateUserDTO) {
    // Registrar usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Error al crear usuario')

    // Crear perfil con rol
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        role: userData.role
      })
      .select()
      .single()

    if (profileError) throw profileError

    return {
      id: authData.user.id,
      email: authData.user.email,
      profile: {
        id: profile.id,
        user_id: profile.user_id,
        role: profile.role,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
    } as User
  },

  // Actualizar rol de usuario (solo SUPER_ADMIN)
  async updateRole(userId: string, roleData: UpdateUserRoleDTO) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: roleData.role })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    // Obtener email solo si es el usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    const email = user?.id === userId ? user.email : undefined

    return {
      id: userId,
      email,
      profile: {
        id: data.id,
        user_id: data.user_id,
        role: data.role,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } as User
  },

  // Eliminar usuario (solo SUPER_ADMIN)
  async delete(userId: string) {
    // Eliminar perfil (esto debería cascadear con auth.users si está configurado)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId)

    if (error) throw error

    // Nota: Eliminar de auth.users requiere admin API, se puede hacer desde Supabase Dashboard
  }
}

