import { useState } from 'react'
import axios from 'axios'
import { PlusCircle, Upload, X, MapPin, Calendar, Phone, Tag, ArrowLeft } from 'lucide-react'
import { API_BASE_URL } from '../App'
import confetti from 'canvas-confetti'

function ReportItem({ user, onSuccess, onNavigate, initialType }) {
  const [itemName, setItemName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [contact, setContact] = useState('')
  const [itemType, setItemType] = useState(initialType || 'Lost') // Lost or Found
  
  // Photo Upload States
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [dragActive, setDragActive] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed!')
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError('')
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed!')
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError('')
    }
  }

  const handleClearImage = () => {
    setSelectedFile(null)
    setPreviewUrl('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!user) {
      setError('You must be logged in to report an item.')
      setLoading(false)
      return
    }

    try {
      // 1. Create the item record
      const itemData = {
        item_name: itemName,
        description,
        category,
        location,
        date,
        contact,
        item_type: itemType,
        status: 'Pending'
      }

      const res = await axios.post(`${API_BASE_URL}/items`, itemData)
      const createdItem = res.data

      // 2. Upload the photo if one was selected
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)

        await axios.post(`${API_BASE_URL}/items/${createdItem.id}/upload-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      // Confetti blast on success!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      })

      // Redirect & refresh
      setTimeout(() => {
        onSuccess()
      }, 1000)

    } catch (err) {
      console.error(err)
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail)
      } else {
        setError('Failed to report item. Please try again.')
      }
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      
      {/* Back to Dashboard */}
      <button 
        onClick={() => onNavigate('dashboard')}
        className="btn btn-secondary"
        style={{
          padding: '8px 16px',
          fontSize: '0.85rem',
          marginBottom: '24px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </button>

      <div className="glass" style={{
        padding: '40px',
        borderRadius: 'var(--border-radius-lg)',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlusCircle size={28} color="var(--accent-color)" />
            Report Lost or Found Item
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Provide details about the object. The more details you share, the easier it is to verify.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '12px 16px',
            borderRadius: 'var(--border-radius-sm)',
            marginBottom: '24px',
            color: '#f87171',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Status Switcher (Lost vs Found Type) */}
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <span className="input-label">Report Type</span>
            <div style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              padding: '4px',
              borderRadius: '10px',
              width: '260px'
            }}>
              <button 
                type="button" 
                onClick={() => setItemType('Lost')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: itemType === 'Lost' ? 'var(--status-lost)' : 'transparent',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Lost
              </button>
              <button 
                type="button" 
                onClick={() => setItemType('Found')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: itemType === 'Found' ? 'var(--status-found)' : 'transparent',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Found
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            {/* Item Name */}
            <div className="input-group">
              <span className="input-label">Item Name*</span>
              <input 
                type="text" 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)} 
                className="form-input" 
                placeholder="e.g. Leather Wallet, iPhone 13" 
                required 
              />
            </div>

            {/* Category */}
            <div className="input-group">
              <span className="input-label">Category*</span>
              <div style={{ position: 'relative' }}>
                <Tag size={16} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }} />
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="form-select"
                  style={{ paddingLeft: '42px' }}
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
            </div>
          </div>

          {/* Description */}
          <div className="input-group">
            <span className="input-label">Description / Details*</span>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="form-textarea" 
              placeholder="e.g. Black leather Tommy Hilfiger wallet containing a student ID and metro card. Lost near the cafeteria..." 
              required 
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            {/* Location */}
            <div className="input-group">
              <span className="input-label">Location*</span>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="form-input" 
                  placeholder="e.g. Central Library, 2nd floor" 
                  style={{ paddingLeft: '42px' }}
                  required 
                />
              </div>
            </div>

            {/* Date */}
            <div className="input-group">
              <span className="input-label">Date*</span>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="form-input" 
                  style={{ paddingLeft: '42px' }}
                  required 
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="input-group">
            <span className="input-label">Contact Information*</span>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="var(--text-muted)" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input 
                type="text" 
                value={contact} 
                onChange={(e) => setContact(e.target.value)} 
                className="form-input" 
                placeholder="e.g. Call or Text +1 234-567-8901, Telegram @username" 
                style={{ paddingLeft: '42px' }}
                required 
              />
            </div>
          </div>

          {/* Photo Drag & Drop Upload */}
          <div className="input-group" style={{ marginBottom: '32px' }}>
            <span className="input-label">Item Photo (Optional)</span>
            
            {previewUrl ? (
              <div style={{
                position: 'relative',
                borderRadius: 'var(--border-radius-sm)',
                overflow: 'hidden',
                height: '200px',
                border: '1px solid var(--border-color)',
                background: '#000'
              }}>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }} 
                />
                <button
                  type="button"
                  onClick={handleClearImage}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s'
                  }}
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: '2px dashed',
                  borderColor: dragActive ? 'var(--accent-color)' : 'var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '30px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <input 
                  type="file"
                  id="image-upload"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <Upload size={32} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Drag & Drop file here or click to browse
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Supports JPEG, PNG, WEBP (Max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Submitting Report...' : `Submit ${itemType} Item Report`}
          </button>

        </form>

      </div>
    </div>
  )
}

export default ReportItem
