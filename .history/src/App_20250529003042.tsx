import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import Bookshelf from './components/Bookshelf'
import Wishlist from './components/Wishlist'
import Blog from './components/Blog'
import ParentDashboard from './components/ParentDashboard'
import Navigation from './components/Navigation'
import { BookProvider } from './contexts/BookContext'
import { UserProvider } from './contexts/UserContext'

function App() {
  const [isParentMode, setIsParentMode] = useState(false)

  return (
    <UserProvider>
      <BookProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
            <Navigation isParentMode={isParentMode} setIsParentMode={setIsParentMode} />
            
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/bookshelf" element={<Bookshelf />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/parent" element={<ParentDashboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </BookProvider>
    </UserProvider>
  )
}

export default App
