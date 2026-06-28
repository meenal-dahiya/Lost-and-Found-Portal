import { useState, useEffect } from 'react'
import axios from 'axios'
import { Sidebar, Header } from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ReportItem from './pages/ReportItem'
import Auth from './pages/Auth'
import Profile from './pages/Profile'

export const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard') // dashboard, report, auth, profile
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [items, setItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [showSplash, setShowSplash] = useState(true)
  const [fadeSplash, setFadeSplash] = useState(false)

  // Splash screen timers
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeSplash(true), 2200)
    const closeTimer = setTimeout(() => setShowSplash(false), 3000)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(closeTimer)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Global click bubble pop effect ("Lost", "Found", etc.)
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const clickWords = ["Lost 🔍", "Found 💎", "Claimed 🤝", "Returned 📦"]
      const word = clickWords[Math.floor(Math.random() * clickWords.length)]
      
      const el = document.createElement('div')
      el.className = 'click-pop-effect'
      el.innerText = word
      el.style.left = `${e.pageX}px`
      el.style.top = `${e.pageY}px`
      
      document.body.appendChild(el)
      
      setTimeout(() => {
        el.remove()
      }, 900)
    }
    
    window.addEventListener('click', handleGlobalClick)
    return () => window.removeEventListener('click', handleGlobalClick)
  }, [])

  // Configure Axios default headers if token exists
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }

  // Check auth on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const res = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          })
          setUser(res.data)
          setToken(storedToken)
        } catch (err) {
          console.error("Auth check failed, logging out...", err)
          handleLogout()
        }
      }
      fetchItems()
    }
    initAuth()
  }, [token])

  const fetchItems = async () => {
    setItemsLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/items`)
      setItems(res.data)
    } catch (err) {
      console.error("Failed to fetch items:", err)
    } finally {
      setItemsLoading(false)
    }
  }

  const handleLogin = (newToken, userData) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    setCurrentPage('dashboard')
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
    setCurrentPage('dashboard')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            items={items} 
            loading={itemsLoading} 
            user={user} 
            refreshItems={fetchItems} 
            onNavigate={setCurrentPage} 
          />
        )
      case 'report-lost':
      case 'report-found':
        return (
          <ReportItem 
            initialType={currentPage === 'report-lost' ? 'Lost' : 'Found'}
            user={user} 
            onSuccess={() => {
              fetchItems()
              setCurrentPage('dashboard')
            }} 
            onNavigate={setCurrentPage}
          />
        )
      case 'auth':
        return (
          <Auth 
            onLoginSuccess={handleLogin} 
            onNavigate={setCurrentPage} 
          />
        )
      case 'profile':
        return (
          <Profile 
            user={user} 
            items={items} 
            refreshItems={fetchItems} 
            onNavigate={setCurrentPage} 
          />
        )
      default:
        return (
          <Dashboard 
            items={items} 
            loading={itemsLoading} 
            user={user} 
            refreshItems={fetchItems} 
            onNavigate={setCurrentPage} 
          />
        )
    }
  }

  // Fullscreen layout when not logged in
  if (!user) {
    return (
      <div className="app-container flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', flexDirection: 'column' }}>
        {showSplash && (
          <div className={`splash-container ${fadeSplash ? 'splash-fade-out' : ''}`}>
            <img src="/anime_mascot.png" alt="Mascot" className="splash-character" />
            <h1 className="splash-title">LOST <span className="gradient-text">&</span> FOUND</h1>
            <p className="splash-subtitle">Reuniting you with your lost treasures...</p>
            <div className="splash-loader"></div>
          </div>
        )}
        <div style={{ width: '100%', maxWidth: '440px', padding: '20px' }}>
          <Auth onLoginSuccess={handleLogin} onNavigate={setCurrentPage} />
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      {showSplash && (
        <div className={`splash-container ${fadeSplash ? 'splash-fade-out' : ''}`}>
          <img src="/anime_mascot.png" alt="Mascot" className="splash-character" />
          <h1 className="splash-title">LOST <span className="gradient-text">&</span> FOUND</h1>
          <p className="splash-subtitle">Reuniting you with your lost treasures...</p>
          <div className="splash-loader"></div>
        </div>
      )}

      <Sidebar 
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />

      <div className="main-viewport">
        <Header 
          user={user}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          theme={theme}
          setTheme={setTheme}
        />

        <main className="main-content" style={{ padding: '30px 40px' }}>
          {renderPage()}
        </main>

        <footer style={{
          textAlign: 'center', 
          padding: '24px 40px', 
          color: 'var(--text-muted)', 
          fontSize: '0.85rem',
          borderTop: '1px solid var(--border-color)',
          marginTop: 'auto',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <p>&copy; {new Date().getFullYear()} Lost & Found Portal. Built with FastAPI, SQLite, and React.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
