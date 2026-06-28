import { useState } from 'react'
import ItemCard from '../components/ItemCard'
import { Search, Tag, MapPin, SlidersHorizontal, AlertCircle, Info, ChevronRight, PlusCircle, CheckCircle2, User, PhoneCall, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react'
import { API_BASE_URL } from '../App'

function Dashboard({ items, loading, user, refreshItems, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  
  // Modals / Detail Overlays
  const [selectedItem, setSelectedItem] = useState(null)
  const [showSafetyTips, setShowSafetyTips] = useState(false)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)

  // Calculate stats
  const totalItems = items.length
  const lostItemsCount = items.filter(i => i.item_type === 'Lost').length
  const foundItemsCount = items.filter(i => i.item_type === 'Found').length
  const returnedItemsCount = items.filter(i => i.status === 'Returned').length

  const filteredItems = items.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'All' || item.item_type === typeFilter
    const matchesCategory = categoryFilter === 'All' || item.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesLocation = !locationFilter || item.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter
    
    return matchesSearch && matchesType && matchesCategory && matchesLocation && matchesStatus
  })

  // Standard assignment categories
  const categories = ['All', 'Electronics', 'Wallet', 'Keys', 'ID Card', 'Books', 'Mobile', 'Others']

  // Category gradients for row thumbnails
  const getCategoryGradient = (category) => {
    switch (category.toLowerCase()) {
      case 'electronics':
        return 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
      case 'wallet':
        return 'linear-gradient(135deg, #065f46 0%, #10b981 100%)';
      case 'keys':
        return 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)';
      case 'id card':
        return 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)';
      case 'books':
        return 'linear-gradient(135deg, #581c87 0%, #8b5cf6 100%)';
      case 'mobile':
        return 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)';
      default:
        return 'linear-gradient(135deg, #1e293b 0%, #475569 100%)';
    }
  }

  // Reset all filters to view all items
  const handleResetFilters = () => {
    setSearchTerm('')
    setTypeFilter('All')
    setCategoryFilter('All')
    setLocationFilter('')
    setStatusFilter('All')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* 1. Welcome Banner */}
      <div className="glass" style={{
        padding: '30px 40px',
        borderRadius: 'var(--border-radius-lg)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ zIndex: 2 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
            Welcome back, <span style={{ color: 'var(--accent-color)' }}>{user ? user.name : 'Student'}</span>! 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
            Let's help reunite lost items with their owners.
          </p>
        </div>
        
        {/* Right side illustration absolute container */}
        <div style={{
          position: 'absolute',
          right: '40px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '180px',
          height: '130px',
          zIndex: 1,
          opacity: 0.95
        }}>
          <img 
            src="/box_illustration.png" 
            alt="Lost Box Illustration" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
              // Fallback to mascot
              e.target.src = '/anime_mascot.png';
            }}
          />
        </div>
      </div>

      {/* 2. Stats Grid (4 columns with sparklines) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
      }}>
        {/* Card 1: Total Reports */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Reports</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '4px 0 2px 0', color: 'var(--text-primary)' }}>{totalItems}</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 600 }}>+12 this week</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
              <Tag size={18} />
            </div>
            <svg viewBox="0 0 100 30" width="70" height="20" style={{ stroke: 'var(--accent-color)', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', opacity: 0.7 }}>
              <path d="M 0 25 Q 15 20 30 25 T 60 10 T 80 5 T 100 15" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Lost */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Lost</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '4px 0 2px 0', color: 'var(--status-lost)' }}>{lostItemsCount}</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--status-lost)', fontWeight: 600 }}>+8 this week</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-lost)' }}>
              <AlertCircle size={18} />
            </div>
            <svg viewBox="0 0 100 30" width="70" height="20" style={{ stroke: 'var(--status-lost)', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', opacity: 0.7 }}>
              <path d="M 0 20 Q 20 25 40 15 T 70 20 T 90 28 T 100 25" />
            </svg>
          </div>
        </div>

        {/* Card 3: Total Found */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Found</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '4px 0 2px 0', color: 'var(--status-found)' }}>{foundItemsCount}</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--status-found)', fontWeight: 600 }}>+5 this week</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-found)' }}>
              <CheckCircle2 size={18} />
            </div>
            <svg viewBox="0 0 100 30" width="70" height="20" style={{ stroke: 'var(--status-found)', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', opacity: 0.7 }}>
              <path d="M 0 28 Q 15 20 30 18 T 60 12 T 80 5 T 100 8" />
            </svg>
          </div>
        </div>

        {/* Card 4: Total Returned */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Returned</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '4px 0 2px 0', color: '#3b82f6' }}>{returnedItemsCount}</h2>
            <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600 }}>+7 this week</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <ChevronRight size={18} />
            </div>
            <svg viewBox="0 0 100 30" width="70" height="20" style={{ stroke: '#3b82f6', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', opacity: 0.7 }}>
              <path d="M 0 28 C 30 28 40 10 70 8 C 80 8 90 20 100 15" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Search & Filters Row */}
      <div className="glass" style={{
        padding: '24px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={18} color="var(--accent-color)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Search & Filters</h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 120px',
          gap: '16px'
        }}>
          {/* Keyword Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              placeholder="Search by name, description..."
              style={{ paddingLeft: '42px' }}
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-select"
          >
            <option value="All">All Types</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
          >
            <option value="All">All Categories</option>
            {categories.slice(1).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Claimed">Claimed</option>
            <option value="Returned">Returned</option>
          </select>

          {/* Location filter */}
          <div style={{ position: 'relative' }}>
            <MapPin size={16} color="var(--text-muted)" style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input 
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="form-input"
              placeholder="Filter by location..."
              style={{ paddingLeft: '42px' }}
            />
          </div>

          {/* Search Button */}
          <button 
            onClick={handleResetFilters}
            className="btn btn-secondary"
            style={{ width: '100%', height: '100%', borderRadius: '10px' }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* 4. Three Column Main Grid */}
      <div className="dashboard-grid">
        
        {/* Column 1: Recent Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Lost & Found Items</h3>
            <button 
              onClick={handleResetFilters}
              style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              View all
            </button>
          </div>

          {loading ? (
            <div className="glass flex-center" style={{ padding: '40px', borderRadius: '16px', minHeight: '260px' }}>
              <div className="spinner" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredItems.slice(0, 5).map(item => (
                <div 
                  key={item.id} 
                  className="item-row-card"
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Image/Gradient Thumbnail */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: getCategoryGradient(item.category),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {item.image_url ? (
                      <img src={`${API_BASE_URL}${item.image_url}`} alt={item.item_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Tag size={18} style={{ opacity: 0.8 }} />
                    )}
                  </div>

                  {/* Text Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.item_name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                      {item.item_type} &bull; {item.location}
                    </span>
                  </div>

                  {/* Badge */}
                  <span className={`badge ${item.item_type === 'Lost' ? 'badge-lost' : 'badge-found'}`} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                    {item.item_type}
                  </span>

                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              ))}
              {filteredItems.length > 5 && (
                <button 
                  onClick={handleResetFilters}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px dashed var(--border-color)',
                    padding: '12px',
                    borderRadius: '12px',
                    color: 'var(--accent-color)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  View all remaining {filteredItems.length - 5} items
                </button>
              )}
            </div>
          ) : (
            <div className="glass flex-center" style={{ padding: '60px 40px', borderRadius: '16px', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
              <AlertCircle size={36} color="var(--text-muted)" />
              <div>
                <h4 style={{ margin: 0 }}>No items reported</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>Try adjusting your search filters or report a new item.</p>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Items Near You Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Items Near You</h3>
            <span style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => alert("Map details coming soon!")}>
              View map &gt;
            </span>
          </div>

          {/* Map canvas mockup */}
          <div className="glass" style={{
            height: '315px',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Grid background lines */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }} />

            {/* Stylized vector map elements */}
            <div style={{
              position: 'absolute',
              width: '80%',
              height: '80%',
              border: '2px dashed rgba(99, 102, 241, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '60%',
                height: '60%',
                border: '2px dashed rgba(99, 102, 241, 0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Center marker (You) */}
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-color)',
                  border: '3px solid #fff',
                  boxShadow: '0 0 10px var(--accent-glow)',
                  zIndex: 10
                }} />
              </div>
            </div>

            {/* Simulated map pins */}
            {/* Pin 1: Lost - Library (Red) */}
            <div style={{ position: 'absolute', top: '25%', left: '30%', cursor: 'pointer', zIndex: 12 }} onClick={() => alert("Lost item reported at Library")}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--status-lost)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)', border: '2px solid #fff' }}>
                <MapPin size={12} />
              </div>
            </div>
            
            {/* Pin 2: Found - Cafeteria (Green) */}
            <div style={{ position: 'absolute', top: '40%', left: '70%', cursor: 'pointer', zIndex: 12 }} onClick={() => alert("Found item reported near Cafeteria")}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--status-found)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)', border: '2px solid #fff' }}>
                <MapPin size={12} />
              </div>
            </div>

            {/* Pin 3: Returned - Block C (Blue) */}
            <div style={{ position: 'absolute', bottom: '25%', top: 'auto', left: '55%', cursor: 'pointer', zIndex: 12 }} onClick={() => alert("Returned item near Block C")}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)', border: '2px solid #fff' }}>
                <MapPin size={12} />
              </div>
            </div>

            {/* Bottom Overlay button */}
            <button 
              onClick={() => alert("Checking nearby reports...")}
              className="btn btn-secondary"
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.8rem',
                padding: '8px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MapPin size={12} />
              View all nearby items
            </button>
          </div>
        </div>

        {/* Column 3: Quick Actions & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Actions Panel */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Quick Actions</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {/* Report Lost button */}
              <button 
                onClick={() => onNavigate('report-lost')}
                className="glass glass-interactive" 
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlusCircle size={16} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Report Lost Item</span>
              </button>

              {/* Report Found button */}
              <button 
                onClick={() => onNavigate('report-found')}
                className="glass glass-interactive" 
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-found)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Report Found Item</span>
              </button>

              {/* My Reports */}
              <button 
                onClick={() => onNavigate('profile')}
                className="glass glass-interactive" 
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>My Reports</span>
              </button>

              {/* Emergency Contact */}
              <button 
                onClick={() => setShowEmergencyModal(true)}
                className="glass glass-interactive" 
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-lost)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhoneCall size={16} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Emergency Help</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Recent Activity</h3>

            <div className="glass" style={{
              padding: '20px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              {/* Event 1 */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-found)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <CheckCircle2 size={12} />
                </div>
                <div>
                  <p style={{ fontSize: '0.82rem', margin: 0, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    Your reported item "Black Wallet" has been marked as returned.
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 hours ago</span>
                </div>
              </div>

              {/* Event 2 */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <MapPin size={12} />
                </div>
                <div>
                  <p style={{ fontSize: '0.82rem', margin: 0, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    New found item "Keys with Keychain" reported near Block B.
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5 hours ago</span>
                </div>
              </div>

              {/* Event 3 */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Tag size={12} />
                </div>
                <div>
                  <p style={{ fontSize: '0.82rem', margin: 0, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    Your report "Laptop Bag" is getting popular.
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 day ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. Stay Safe Banner */}
      <div className="glass" style={{
        background: 'linear-gradient(135deg, var(--accent-color) 0%, #ec4899 100%)',
        padding: '20px 40px',
        borderRadius: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        color: '#fff',
        boxShadow: '0 4px 20px var(--accent-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ShieldCheck size={26} />
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Stay Safe & Aware</h4>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
              Always meet in public places on campus and verify the item details before claiming.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowSafetyTips(true)}
          className="btn" 
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.4)',
            padding: '8px 18px',
            fontSize: '0.85rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
        >
          View Safety Tips
        </button>
      </div>

      {/* --- Detail Overlay Modal --- */}
      {selectedItem && (
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
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <ItemCard 
              item={selectedItem}
              user={user}
              refreshItems={refreshItems}
              onDelete={() => {
                setSelectedItem(null)
                refreshItems()
              }}
            />
            <button 
              onClick={() => setSelectedItem(null)}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '12px', borderRadius: '10px' }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* --- Safety Tips Modal --- */}
      {showSafetyTips && (
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
          <div className="glass" style={{ width: '100%', maxWidth: '440px', padding: '30px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', color: 'var(--accent-color)' }}>
              <ShieldCheck size={24} />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Campus Safety Tips</h3>
            </div>
            
            <ul style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Public Meetings</strong>: Arrange to meet in public campus zones like the Library, Cafeteria, or Main Gate.</li>
              <li><strong>Daylight Hours</strong>: Meet during broad daylight hours. Never meet in secluded areas or at night.</li>
              <li><strong>Verification</strong>: Ask the claimant details not listed in the public description (e.g., wallet contents, serial numbers, wallpapers) to verify ownership.</li>
              <li><strong>No Payments</strong>: Do not pay finders for returning lost belongings. It's a student help portal.</li>
              <li><strong>Take a friend</strong>: If you feel uncomfortable, take a roommate or classmate along.</li>
            </ul>

            <button 
              onClick={() => setShowSafetyTips(false)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '24px', borderRadius: '10px' }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* --- Emergency Modal --- */}
      {showEmergencyModal && (
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
          <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', color: 'var(--status-lost)' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Campus Emergency Help</h3>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              If you feel unsafe or have encountered fraud/theft on campus, contact the relevant help numbers:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CAMPUS SECURITY</span>
                <h4 style={{ margin: '2px 0 0 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>+1-202-555-0143</h4>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'rgba(99, 102, 241, 0.05)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>STUDENT PORTAL SUPPORT</span>
                <h4 style={{ margin: '2px 0 0 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>support@lostfound.edu</h4>
              </div>
            </div>

            <button 
              onClick={() => setShowEmergencyModal(false)}
              className="btn btn-secondary"
              style={{ width: '100%', borderRadius: '10px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard
