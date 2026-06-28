import { useState } from 'react'
import axios from 'axios'
import { Lock, Mail, User as UserIcon, AlertTriangle, ArrowRight } from 'lucide-react'
import { API_BASE_URL } from '../App'

function Auth({ onLoginSuccess, onNavigate }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Student registration states
  const [name, setName] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('1st Year')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Client-side validations
    if (!username || !password) {
      setError('Please fill in all required fields.')
      setLoading(false)
      return
    }

    if (!isLogin) {
      if (!email) {
        setError('Please fill in your email address.')
        setLoading(false)
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        setLoading(false)
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.')
        setLoading(false)
        return
      }
    }

    try {
      if (isLogin) {
        // OAuth2 password flow expects x-www-form-urlencoded data
        const formData = new URLSearchParams()
        formData.append('username', username)
        formData.append('password', password)

        const res = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })

        const token = res.data.access_token

        // Fetch user data
        const userRes = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        onLoginSuccess(token, userRes.data)
      } else {
        // Register flow
        await axios.post(`${API_BASE_URL}/auth/register`, {
          username,
          email,
          password,
          name,
          roll_number: rollNumber,
          department,
          year
        })
        
        // Auto-login after registration
        const formData = new URLSearchParams()
        formData.append('username', username)
        formData.append('password', password)

        const res = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })

        const token = res.data.access_token

        const userRes = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        onLoginSuccess(token, userRes.data)
      }
    } catch (err) {
      console.error(err)
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail
        if (typeof detail === 'string') {
          setError(detail)
        } else if (Array.isArray(detail)) {
          setError(detail.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', '))
        } else {
          setError('Validation error occurred.')
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 250px)' }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '440px',
        borderRadius: 'var(--border-radius-lg)',
        padding: '40px',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {isLogin ? 'Sign in to manage and report lost items' : 'Join our community portal today'}
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '24px'
        }}>
          <button 
            type="button" 
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isLogin ? 'var(--accent-color)' : 'transparent',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: !isLogin ? 'var(--accent-color)' : 'transparent',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Register
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '12px 16px',
            borderRadius: 'var(--border-radius-sm)',
            marginBottom: '20px',
            color: '#f87171',
            fontSize: '0.85rem'
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-group">
            <span className="input-label">Username</span>
            <div style={{ position: 'relative' }}>
              <UserIcon size={16} color="var(--text-muted)" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Enter username"
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          {/* Email (only on Register) */}
          {!isLogin && (
            <div className="input-group">
              <span className="input-label">Email Address</span>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="name@example.com"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>
          )}

          {/* Full Name (only on Register) */}
          {!isLogin && (
            <div className="input-group">
              <span className="input-label">Full Name</span>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="Enter full name"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>
          )}

          {/* Roll Number (only on Register) */}
          {!isLogin && (
            <div className="input-group">
              <span className="input-label">Roll Number</span>
              <input 
                type="text" 
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="form-input"
                placeholder="e.g. 2023CSB1024"
                required
              />
            </div>
          )}

          {/* Department & Year (only on Register) */}
          {!isLogin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Department</span>
                <input 
                  type="text" 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="form-input"
                  placeholder="e.g. CSE, ECE"
                  required
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Year</span>
                <select 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="input-group">
            <span className="input-label">Password</span>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          {/* Confirm Password (only on Register) */}
          {!isLogin && (
            <div className="input-group">
              <span className="input-label">Confirm Password</span>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Auth
