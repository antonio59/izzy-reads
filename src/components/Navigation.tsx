import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Heart, PenTool, Home, Settings, Shield, Feather } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

interface NavigationProps {
  isParentMode: boolean
  setIsParentMode: (mode: boolean) => void
}

const Navigation: React.FC<NavigationProps> = ({ isParentMode, setIsParentMode }) => {
  const location = useLocation()
  const { user } = useUser()

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: 'bg-purple-500' },
    { path: '/bookshelf', icon: BookOpen, label: 'My Books', color: 'bg-blue-500' },
    { path: '/wishlist', icon: Heart, label: 'Wishlist', color: 'bg-pink-500' },
    { path: '/poems', icon: Feather, label: 'My Poems', color: 'bg-yellow-500' },
    { path: '/blog', icon: PenTool, label: 'My Blog', color: 'bg-green-500' },
  ]

  return (
    <nav className="bg-white shadow-lg border-b-4 border-purple-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-600">Isabella Reads</h1>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? `${item.color} text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Info & Parent Mode Toggle */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Hello, {user.name}! 👋</p>
                <p className="text-xs text-gray-500">Keep reading!</p>
              </div>
            )}
            
            <button
              onClick={() => setIsParentMode(!isParentMode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isParentMode
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isParentMode ? 'Parent Mode' : 'Child Mode'}
              </span>
            </button>

            {isParentMode && (
              <Link
                to="/parent"
                className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Parent Dashboard</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? `${item.color} text-white shadow-lg`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 