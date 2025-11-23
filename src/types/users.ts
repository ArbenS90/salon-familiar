import { UserRole } from './auth'

export interface User {
  id: string
  email?: string
  profile?: {
    id: string
    user_id: string
    role: UserRole
    created_at: string
    updated_at: string
  }
}

export interface CreateUserDTO {
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserRoleDTO {
  role: UserRole
}

