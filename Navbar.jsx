import { MapPin, LayoutDashboard, PlusCircle, CheckCircle2, User, HelpCircle, Heart, BarChart2, Settings, LogOut, ArrowRight, Bell } from 'lucide-react'
import { API_BASE_URL } from '../App'

export function Sidebar({ user, currentPage, onNavigate, onLogout }) {
  return (
    <aside className="sidebar-container">
      {/* Logo */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '20px' }} 
        onClick={() => onNavigate('dashboard')}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: 'var(--accent-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 12px var(--accent-glow)'
        }}>
          <MapPin size={20} />
        </div>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
          LOST<span style={{ color: 'var(--accent-color)' }}>&</span>FOUND
        </span>
      </div>

      {/* Menu Links */}
      <nav className="sidebar-menu">
        <button 
          onClick={() => onNavigate('dashboard')} 
          className={`sidebar-link ${currentPage === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button 
          onClick={() => onNavigate('report-lost')} 
          className={`sidebar-link ${currentPage === 'report-lost' ? 'active' : ''}`}
        >
          <PlusCircle size={18} />
          Report Lost Item
        </button>
        <button 
          onClick={() => onNavigate('report-found')} 
          className={`sidebar-link ${currentPage === 'report-found' ? 'active' : ''}`}
        >
          <CheckCircle2 size={18} />
          Report Found Item
        </button>
        <button 
          onClick={() => onNavigate('profile')} 
          className={`sidebar-link ${currentPage === 'profile' ? 'active' : ''}`}
        >
          <User size={18} />
          My Reports
        </button>
      </nav>

      {/* Sidebar Banner */}
      <div className="sidebar-banner">
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Lost something?</h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
          Report your lost items and increase the chances of getting it back.
        </p>
        <button 
          onClick={() => onNavigate('report-lost')}
          className="btn btn-primary" 
          style={{
            padding: '6px 12px',
            fontSize: '0.75rem',
            borderRadius: '8px',
            marginTop: '8px',
            width: 'fit-content'
          }}
        >
          Report Now <ArrowRight size={12} />
        </button>
      </div>
    </aside>
  )
}

export function Header({ user, currentPage, onNavigate, onLogout, theme, setTheme }) {
  return (
    <header className="top-header">
      {/* Nav Tabs */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <button 
          onClick={() => onNavigate('dashboard')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: currentPage === 'dashboard' ? 'var(--accent-color)' : 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '10px 0',
            borderBottom: currentPage === 'dashboard' ? '2px solid var(--accent-color)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Dashboard
        </button>
        <button 
          onClick={() => onNavigate('report-lost')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: (currentPage === 'report-lost' || currentPage === 'report-found') ? 'var(--accent-color)' : 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '10px 0',
            borderBottom: (currentPage === 'report-lost' || currentPage === 'report-found') ? '2px solid var(--accent-color)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Report Item
        </button>
      </div>

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Theme select dropdown */}
        <select 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
          className="form-select"
          style={{
            padding: '6px 10px',
            fontSize: '0.85rem',
            width: '95px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)'
          }}
        >
          <option value="dark">Dark 🌙</option>
          <option value="light">Light ☀️</option>
          <option value="pinkish">Pinkish 🌸</option>
          <option value="sky">Sky 🔵</option>
        </select>

        {/* Notifications Icon */}
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => alert("No new notifications!")}>
          <Bell size={20} color="var(--text-secondary)" />
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '14px',
            height: '14px',
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: '0.65rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700
          }}>
            1
          </span>
        </div>

        {/* User profile details */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              onClick={() => onNavigate('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {user.profile_picture_url ? (
                <img 
                  src={`${API_BASE_URL}${user.profile_picture_url}`}
                  alt={user.username}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-color)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.username}</span>
            </div>
            
            {/* Logout */}
            <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => onNavigate('auth')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '8px' }}>
            Login
          </button>
        )}
      </div>
    </header>
  )
}
