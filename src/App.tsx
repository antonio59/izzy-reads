import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import PublicPortfolio from './components/PublicPortfolio'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import EnhancedBookshelf from './components/EnhancedBookshelf'
import Wishlist from './components/Wishlist'
import Poems from './components/Poems'
import Blog from './components/Blog'
import ParentDashboard from './components/ParentDashboard'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import { BookProvider } from './contexts/BookContext'
import { UserProvider } from './contexts/UserContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const [isParentMode, setIsParentMode] = useState(false)

  return (
    <AuthProvider>
      <UserProvider>
        <BookProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicPortfolio />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
                      <Navigation isParentMode={isParentMode} setIsParentMode={setIsParentMode} />
                      <main className="container mx-auto px-4 py-8">
                        <Dashboard />
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookshelf"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
                      <Navigation isParentMode={isParentMode} setIsParentMode={setIsParentMode} />
                      <main className="container mx-auto px-4 py-8">
                        <EnhancedBookshelf />
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
                      <Navigation isParentMode={isParentMode} setIsParentMode={setIsParentMode} />
                      <main className="container mx-auto px-4 py-8">
                        <Wishlist />
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/poems"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
                      <Navigation isParentMode={isParentMode} setIsParentMode={setIsParentMode} />
                      <main className="container mx-auto px-4 py-8">
                        <Poems />
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
                      <Navigation isParentMode={isParentMode} setIsParentMode={setIsParentMode} />
                      <main className="container mx-auto px-4 py-8">
                        <Blog />
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parent"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
                      <Navigation isParentMode={isParentMode} setIsParentMode={setIsParentMode} />
                      <main className="container mx-auto px-4 py-8">
                        <ParentDashboard />
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </BookProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
