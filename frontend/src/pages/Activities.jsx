import { useState, useEffect } from 'react'
import axios from 'axios'
import BookingModal from '../components/BookingModal'

const TYPE_LABELS = {
  all: '🌟 All',
  hiking: '🥾 Hiking',
  water: '🌊 Water Sports',
  nightlife: '🌙 Nightlife',
  cultural: '🏛️ Cultural',
  adventure: '🧗 Adventure',
}

function Activities() {
  const [activities, setActivities] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [activeType, setActiveType] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/activities/')
      .then(res => { setActivities(res.data); setFiltered(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = activities
    if (activeType !== 'all') result = result.filter(a => a.type === activeType)
    if (search) result = result.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase()) ||
      a.governorate.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [activeType, search, activities])

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', padding: '40px 20px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '36px', marginBottom: '8px' }}>
        🎯 Activities in Lebanon
      </h2>
      <p style={{ textAlign: 'center', color: '#a8b2d8', marginBottom: '32px' }}>
        Adventures, culture, nature and nightlife
      </p>

      {/* Search */}
      <div style={{ maxWidth: '500px', margin: '0 auto 24px' }}>
        <input
          placeholder="🔍 Search activities, locations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 20px', borderRadius: '30px',
            background: '#16213e', border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none'
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <button key={type} onClick={() => setActiveType(type)} style={{
            padding: '10px 22px', borderRadius: '25px', border: 'none',
            cursor: 'pointer', fontWeight: '600', fontSize: '14px',
            background: activeType === type ? 'linear-gradient(135deg, #e94560, #f5a623)' : 'rgba(255,255,255,0.05)',
            color: activeType === type ? '#fff' : '#a8b2d8',
            border: activeType === type ? 'none' : '1px solid rgba(255,255,255,0.1)'
          }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading activities...</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No activities found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '25px', maxWidth: '1200px', margin: '0 auto'
        }}>
          {filtered.map(a => (
            <div key={a.id} style={{
              background: '#16213e', borderRadius: '16px', padding: '28px',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ color: '#e94560', margin: 0, fontSize: '18px' }}>{a.name}</h3>
                <span style={{
                  background: 'rgba(233,69,96,0.15)', color: '#e94560',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  whiteSpace: 'nowrap', marginLeft: '10px'
                }}>
                  {TYPE_LABELS[a.type] || a.type}
                </span>
              </div>
              <p style={{ color: '#a8b2d8', margin: 0, fontSize: '13px' }}>📍 {a.location}, {a.governorate}</p>
              {a.duration && <p style={{ color: '#a8b2d8', margin: 0, fontSize: '13px' }}>⏱️ {a.duration}</p>}
              <p style={{ color: '#f5a623', margin: 0, fontSize: '14px', fontWeight: '600' }}>
                💰 ${a.price === '0.00' ? 'Free' : a.price}
              </p>
              <p style={{ color: 'white', margin: '8px 0 0', lineHeight: '1.6', fontSize: '14px' }}>
                {a.description}
              </p>
              <button
                onClick={() => setSelected(a)}
                style={{
                  marginTop: '12px', padding: '12px',
                  background: 'linear-gradient(135deg, #e94560, #f5a623)',
                  border: 'none', borderRadius: '10px', color: '#fff',
                  fontWeight: '700', fontSize: '14px', cursor: 'pointer'
                }}>
                🎯 Book Activity
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <BookingModal
          item={selected}
          type="activity"
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

export default Activities