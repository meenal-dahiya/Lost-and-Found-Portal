import { useState } from 'react'
import axios from 'axios'
import { Calendar, MapPin, Phone, Tag, Trash2, Edit3, X, AlertCircle } from 'lucide-react'
import { API_BASE_URL } from '../App'

function ItemCard({ item, user, refreshItems, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const isOwner = user && item.user_id === user.id

  // Form states for editing
  const [editName, setEditName] = useState(item.item_name)
  const [editCategory, setEditCategory] = useState(item.category)
  const [editDescription, setEditDescription] = useState(item.description)
  const [editLocation, setEditLocation] = useState(item.location)
  const [editDate, setEditDate] = useState(item.date)
  const [editContact, setEditContact] = useState(item.contact)
  const [editType, setEditType] = useState(item.item_type)
  const [editStatus, setEditStatus] = useState(item.status)

  // Category gradients for placeholder images
  const getCategoryGradient = (category) => {
    switch (category.toLowerCase()) {
      case 'electronics':
        return 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'; // Deep blue
      case 'wallet':
        return 'linear-gradient(135deg, #065f46 0%, #10b981 100%)'; // Emerald
      case 'keys':
        return 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)'; // Orange
      case 'id card':
        return 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)'; // Deep indigo
      case 'books':
        return 'linear-gradient(135deg, #581c87 0%, #8b5cf6 100%)'; // Purple
      case 'mobile':
        return 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)'; // Sky blue
      default:
        return 'linear-gradient(135deg, #1e293b 0%, #475569 100%)'; // Slate
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (updating) return
    setUpdating(true)
    try {
      await axios.put(`${API_BASE_URL}/items/${item.id}`, {
        item_name: editName,
        category: editCategory,
        description: editDescription,
        location: editLocation,
        date: editDate,
        contact: editContact,
        item_type: editType,
        status: editStatus
      })
      setIsEditing(false)
      refreshItems()
    } catch (err) {
      console.error("Failed to update item:", err)
      alert("Failed to update item details.")
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return
    try {
      await axios.delete(`${API_BASE_URL}/items/${item.id}`)
      onDelete(item.id)
    } catch (err) {
      console.error("Failed to delete item:", err)
      alert("Failed to delete item.")
    }
  }

  return (
    <div className="glass glass-interactive" style={{
      borderRadius: 'var(--border-radius-md)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Item Image or Placeholder */}
      <div style={{
        height: '180px',
        width: '100%',
        position: 'relative',
        background: getCategoryGradient(item.category),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {item.image_url ? (
          <img 
            src={`${API_BASE_URL}${item.image_url}`} 
            alt={item.item_name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <Tag size={40} style={{ opacity: 0.7 }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
              {item.category}
            </span>
          </div>
        )}

        {/* Status Badge overlay */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '6px'
        }}>
          <span className={`badge ${item.item_type === 'Lost' ? 'badge-lost' : 'badge-found'}`}>
            {item.item_type}
          </span>
          <span className="badge" style={{
            backgroundColor: item.status === 'Returned' ? 'rgba(59, 130, 246, 0.15)' : item.status === 'Claimed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: item.status === 'Returned' ? '#3b82f6' : item.status === 'Claimed' ? '#10b981' : '#f87171',
            border: `1px solid ${item.status === 'Returned' ? '#3b82f6' : item.status === 'Claimed' ? '#10b981' : '#f87171'}`
          }}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
        {/* Name and Category */}
        <div style={{ marginBottom: '12px' }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--accent-color)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {item.category}
          </span>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            marginTop: '2px',
            color: 'var(--text-primary)'
          }}>
            {item.item_name}
          </h3>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.4',
          marginBottom: '20px',
          flex: 1
        }}>
          {item.description}
        </p>

        {/* Details List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span><strong>Location:</strong> {item.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span><strong>Date:</strong> {item.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span><strong>Contact:</strong> {item.contact}</span>
          </div>
          {item.reporter && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              {item.reporter.profile_picture_url ? (
                <img 
                  src={`${API_BASE_URL}${item.reporter.profile_picture_url}`}
                  alt={item.reporter.username}
                  style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {item.reporter.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Reported by <strong>{item.reporter.username}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Owner Controls */}
        {isOwner && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: 'auto'
          }}>
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary"
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '0.8rem',
                gap: '4px'
              }}
            >
              <Edit3 size={14} />
              Edit Post
            </button>
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
              style={{
                padding: '8px 12px',
                borderRadius: '8px'
              }}
              title="Delete Report"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal Dialog */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div className="glass" style={{
            width: '100%',
            maxWidth: '560px',
            borderRadius: 'var(--border-radius-md)',
            padding: '30px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Edit Post Details</h3>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Type */}
                <div className="input-group">
                  <span className="input-label">Type</span>
                  <select 
                    value={editType} 
                    onChange={(e) => setEditType(e.target.value)} 
                    className="form-select"
                  >
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </select>
                </div>
                {/* Status */}
                <div className="input-group">
                  <span className="input-label">Status</span>
                  <select 
                    value={editStatus} 
                    onChange={(e) => setEditStatus(e.target.value)} 
                    className="form-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Claimed">Claimed</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>
              </div>

              {/* Item Name */}
              <div className="input-group">
                <span className="input-label">Item Name</span>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              {/* Category */}
              <div className="input-group">
                <span className="input-label">Category</span>
                <select 
                  value={editCategory} 
                  onChange={(e) => setEditCategory(e.target.value)} 
                  className="form-select"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Keys">Keys</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Books">Books</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Description */}
              <div className="input-group">
                <span className="input-label">Description</span>
                <textarea 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  className="form-textarea" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Location */}
                <div className="input-group">
                  <span className="input-label">Location</span>
                  <input 
                    type="text" 
                    value={editLocation} 
                    onChange={(e) => setEditLocation(e.target.value)} 
                    className="form-input" 
                    required 
                  />
                </div>
                {/* Date */}
                <div className="input-group">
                  <span className="input-label">Date</span>
                  <input 
                    type="date" 
                    value={editDate} 
                    onChange={(e) => setEditDate(e.target.value)} 
                    className="form-input" 
                    required 
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="input-group" style={{ marginBottom: '28px' }}>
                <span className="input-label">Contact</span>
                <input 
                  type="text" 
                  value={editContact} 
                  onChange={(e) => setEditContact(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updating}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemCard
