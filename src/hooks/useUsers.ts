import { useState, useEffect } from 'react'
import { usersService } from '../services/usersService'
import { User, CreateUserDTO, UpdateUserRoleDTO } from '../types/users'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await usersService.getAll()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const createUser = async (userData: CreateUserDTO) => {
    try {
      const newUser = await usersService.create(userData)
      setUsers([newUser, ...users])
      return newUser
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateUserRole = async (userId: string, roleData: UpdateUserRoleDTO) => {
    try {
      const updated = await usersService.updateRole(userId, roleData)
      setUsers(users.map(u => u.id === userId ? updated : u))
      return updated
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await usersService.delete(userId)
      setUsers(users.filter(u => u.id !== userId))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    users,
    loading,
    error,
    createUser,
    updateUserRole,
    deleteUser,
    refresh: loadUsers
  }
}

