import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, UserSettings } from '../types'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isParentMode: boolean
  setIsParentMode: (mode: boolean) => void
  updateUserSettings: (settings: Partial<UserSettings>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isParentMode, setIsParentMode] = useState(false)

  // Initialize with default user for demo purposes
  useEffect(() => {
    const defaultUser: User = {
      id: '1',
      name: 'Isabella',
      age: 10,
      isParent: false,
      settings: {
        theme: 'colorful',
        readingGoal: 20,
        notifications: true,
        parentalControls: {
          requireApproval: true,
          contentFilter: true,
          allowedGenres: ['Fiction', 'Fantasy', 'Adventure', 'Mystery', 'Science Fiction']
        }
      }
    }
    setUser(defaultUser)
  }, [])

  const updateUserSettings = (newSettings: Partial<UserSettings>) => {
    if (user) {
      setUser({
        ...user,
        settings: {
          ...user.settings,
          ...newSettings
        }
      })
    }
  }

  const value = {
    user,
    setUser,
    isParentMode,
    setIsParentMode,
    updateUserSettings
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
} 