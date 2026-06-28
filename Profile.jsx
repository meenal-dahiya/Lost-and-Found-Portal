import { User, Mail, Calendar, MapPin, Tag, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../App'
import ItemCard from '../components/ItemCard'

function Profile({ user, items, refreshItems, onNavigate }) {
  const [updatingId, setUpdatingId] = useState(null)

  if (!user) {
    return (
      <div className="glass flex-center" style={{
        padding: '60px 40px',
        borderRadius: 'var(--border-radius-md)',
        flexDirection: 'column',
        gap: '16px',
        textAlign: 'center'
      }}>
        <AlertCircle size={40} color="var(--text-muted)" />
        <div>
          <h3>Access Denied</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You must be logged in to view your profile.</p>
        </div>
        <button onClick={() => onNavigate('auth')} className="btn btn-primary">
          Sign In
        </button>
      </div>
    )
  }

  // Filter items reported by the user
  const userItems = items.filter(item => item.user_id === user.id)

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      await axios.post(`${API_BASE_URL}/auth/me/profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      window.location.reload() // Reload app context to update avatar header
    } catch (err) {
      console.error(err)
      alert("Failed to upload profile picture.")
    }
  }

  const handleToggleStatus = async (item) => {
    if (updatingId) return
    setUpdatingId(item.id)
    const newStatus = item.status === 'Lost' ? 'Found' : 'Lost'
    try {
      await axios.patch(`${API_BASE_URL}/items/${item.id}/status`, {
        status: newStatus
      })
      refreshItems()
    } catch (err) {
      console.error("Failed to update status:", err)
      alert("Failed to update status.")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return
    try {
      await axios.delete(`${API_BASE_URL}/items/${itemId}`)
      refreshItems()
    } catch (err) {
      console.error("Failed to delete item:", err)
      alert("Failed to delete item.")
    }
  }

  const formattedDate = new Date(user.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Profile Card header */}
      <div className="glass" style={{
        padding: '30px 40px',
        borderRadius: 'var(--border-radius-lg)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '30px',
      }}>
        {/* Avatar with click-to-upload */}
        <div 
          onClick={() => document.getElementById('profile-pic-input').click()}
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-tertiary)',
            border: '2px solid var(--accent-color)'
          }}
          title="Click to upload profile picture"
        >
          {user.profile_picture_url ? (
            <img 
              src={`${API_BASE_URL}${user.profile_picture_url}`} 
              alt={user.username}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, var(--accent-color) 0%, #a78bfa 100%)',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <input 
            type="file" 
            id="profile-pic-input" 
            onChange={handleProfilePicChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        {/* User Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '240px' }}>
          <h2 style={{ fontSize: '1.8rem', lineHeight: 1.1 }}>{user.name}</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '8px 16px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <span>{user.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Roll No:</span>
              <span>{user.roll_number}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Dept:</span>
              <span>{user.department}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Year:</span>
              <span>{user.year}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', gridColumn: '1 / -1', marginTop: '4px' }}>
              <Calendar size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <span>Student since {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          gap: '24px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          padding: '16px 24px',
          borderRadius: 'var(--border-radius-md)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Your Posts</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{userItems.length}</h3>
          </div>
        </div>
      </div>


      {/* Reported Items List */}
      <div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>Your Reported Items</h3>

        {userItems.length > 0 ? (
          <div className="grid-cols-3">
            {userItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                user={user} 
                refreshItems={refreshItems}
                onDelete={refreshItems}
              />
            ))}
          </div>
        ) : (
          <div className="glass flex-center" style={{
            padding: '80px 40px',
            borderRadius: 'var(--border-radius-md)',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'center'
          }}>
            <Tag size={40} color="var(--text-muted)" />
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>No items reported yet</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                If you have lost or found something, you can report it on the portal.
              </p>
            </div>
            <button onClick={() => onNavigate('report')} className="btn btn-primary">
              Report An Item
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
