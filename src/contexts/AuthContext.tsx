import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface AuthUser {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: AuthUser | null
  convexUserId: Id<"users"> | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

const AUTH_STORAGE_KEY = 'izzy-reads-auth'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [convexUserId, setConvexUserId] = useState<Id<"users"> | null>(null)
  const [loading, setLoading] = useState(true)

  const createUser = useMutation(api.users.create)
  const userByEmail = useQuery(
    api.users.getByEmail,
    user?.email ? { email: user.email } : "skip"
  )

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (userByEmail) {
      setConvexUserId(userByEmail._id)
    }
  }, [userByEmail])

  const signIn = async (email: string, _password: string) => {
    const authUser: AuthUser = {
      id: email,
      email,
    }
    setUser(authUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
  }

  const signUp = async (email: string, _password: string, name?: string) => {
    await createUser({
      email,
      name: name || email.split('@')[0],
      isParent: false,
      theme: 'colorful',
      readingGoal: 20,
      notifications: true,
      requireApproval: true,
      contentFilter: true,
      allowedGenres: ['Fiction', 'Fantasy', 'Adventure', 'Mystery', 'Science Fiction'],
    })
    
    const authUser: AuthUser = {
      id: email,
      email,
      name,
    }
    setUser(authUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
  }

  const signOut = async () => {
    setUser(null)
    setConvexUserId(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = {
    user,
    convexUserId,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
