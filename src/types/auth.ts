export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface Profile {
  id: string
  user_id: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email?: string
  profile?: Profile
}

