import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Heart, PenTool, Home, Settings, Shield, Feather, LogOut } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { useAuth } from '../contexts/AuthContext'

interface NavigationProps {
  isParentMode: boolean
  setIsParentMode: (mode: boolean) => void
}

const Navigation: React.FC<NavigationProps> = ({ isParentMode, setIsParentMode }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'bg-purple-500' },
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
            <h1 className="text-2xl font-bold text-purple-600">Izzy Reads</h1>
          </div>

          {/* Navigation Items - Desktop (Icons Only) */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={`p-3 rounded-lg transition-all duration-200 relative group ${
                    isActive
                      ? `${item.color} text-white shadow-lg`
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {/* Tooltip on hover */}
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* User Actions - Desktop (Icons Only) */}
          <div className="flex items-center space-x-2">
            {/* Parent Mode Toggle */}
            <button
              onClick={() => setIsParentMode(!isParentMode)}
              title={isParentMode ? 'Parent Mode' : 'Child Mode'}
              className={`p-3 rounded-lg transition-all duration-200 relative group ${
                isParentMode
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {isParentMode ? 'Parent Mode' : 'Child Mode'}
              </span>
            </button>

            {/* Parent Dashboard Link */}
            {isParentMode && (
              <Link
                to="/parent"
                title="Parent Dashboard"
                className="p-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200 relative group"
              >
                <Settings className="h-5 w-5" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Parent Settings
                </span>
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 relative group"
            >
              <LogOut className="h-5 w-5" />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Logout
              </span>
            </button>
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