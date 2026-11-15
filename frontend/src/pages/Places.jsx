import { useState, useEffect } from 'react'
import axios from 'axios'
import BookingModal from '../components/BookingModal'
import CardImage from '../components/CardImage'
import AccessibilityBadge from '../components/AccessibilityBadge'
import ReviewsBar from '../components/ReviewsBar'
import { isRetired, isAccessible } from '../utils/accessibility'

const selectStyle = {
  padding: '12px 18px', borderRadius: '25px',
  background: '#16213e', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer'
}

const FEE_OPTIONS = {
  all: '💰 All fees',
  free: 'Free',
  low: 'Up to $5',
  high: 'Over $5',
}

function matchesFee(fee, option) {
  if (option === 'all') return true
  if (fee === null || fee === undefined) return false
  const n = Number(fee)
  if (option === 'free') return n === 0
  if (option === 'low') return n > 0 && n <= 5
  if (option === 'high') return n > 5
  return true
}

function Places() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [category, setCategory] = useState('all')
  const [fee, setFee] = useState('all')
  const [accessibleOnly, setAccessibleOnly] = useState(false)
  const retired = isRetired()

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/places/')
      .then(res => { setPlaces(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const regions = [...new Set(places.map(p => p.governorate))].sort()
  const categories = [...new Set(places.map(p => p.category))].sort()

  const filtered = places.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.governorate.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    const matchRegion = region === 'all' || p.governorate === region
    const matchCategory = category === 'all' || p.category === category
    const matchAccess = !accessibleOnly || isAccessible(p)
    return matchSearch && matchRegion && matchCategory && matchesFee(p.entrance_fee, fee) && matchAccess
  })

  const hasFilters = search !== '' || region !== 'all' || category !== 'all' || fee !== 'all' || accessibleOnly

  function clearFilters() {
    setSearch('')
    setRegion('all')
    setCategory('all')
    setFee('all')
    setAccessibleOnly(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', padding: '100px 20px 40px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '36px' }}>🏛️ Places in Lebanon</h2>
      <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Explore Lebanon's historical and natural wonders</p>

      <div style={{ maxWidth: '500px', margin: '24px auto 16px' }}>
        <input
          placeholder="🔍 Search places, regions, categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 20px', borderRadius: '30px',
            background: '#16213e', border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
        <select value={region} onChange={e => setRegion(e.target.value)} style={selectStyle}>
          <option value="all">🏛️ All regions</option>
          {regions.map(x => <option key={x} value={x}>{x}</option>)}
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
          <option value="all">🏷️ All categories</option>
          {categories.map(x => <option key={x} value={x}>{x}</option>)}
        </select>
        <select value={fee} onChange={e => setFee(e.target.value)} style={selectStyle}>
          {Object.entries(FEE_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {retired && (
          <button onClick={() => setAccessibleOnly(!accessibleOnly)} style={{
            ...selectStyle, fontWeight: '600',
            background: accessibleOnly ? 'linear-gradient(135deg, #e94560, #f5a623)' : '#16213e'
          }}>
            ♿ Accessible &amp; partly accessible
          </button>
        )}
        {hasFilters && (
          <button onClick={clearFilters} style={{
            ...selectStyle, background: 'rgba(233,69,96,0.15)', color: '#e94560', fontWeight: '600'
          }}>
            ✖ Clear filters
          </button>
        )}
      </div>

      {!loading && places.length > 0 && (
        <p style={{ textAlign: 'center', color: '#a8b2d8', fontSize: '13px', margin: '0 0 8px' }}>
          Showing {filtered.length} of {places.length} places
        </p>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading places...</p>
      ) : places.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No places yet.</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No places match your filters.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px', maxWidth: '1200px', margin: '24px auto'
        }}>
          {filtered.map(p => (
            <div key={p.id} style={{
              background: '#16213e', borderRadius: '15px', padding: '25px',
              border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <CardImage src={p.image_url} alt={p.name} />
              <h3 style={{ color: '#e94560', margin: '0 0 10px' }}>{p.name}</h3>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🏛️ {p.governorate}</p>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🏷️ {p.category}</p>
              {p.entrance_fee === null && (
                <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🎟️ Fee: not listed</p>
              )}
              {p.entrance_fee > 0 && (
                <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🎟️ ${p.entrance_fee}</p>
              )}
              {p.opening_hours && (
                <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🕐 {p.opening_hours}</p>
              )}
              <AccessibilityBadge value={p.accessibility} />
              <ReviewsBar type="place" item={p} />
              <p style={{ color: 'white', margin: '15px 0 0', lineHeight: '1.5', fontSize: '14px' }}>
                {p.description}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                  onClick={() => setSelected(p)}
                  style={{
                    background: 'linear-gradient(135deg, #e94560, #f5a623)',
                    color: 'white', padding: '10px 20px', borderRadius: '20px',
                    border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}>
                  🎟️ Book Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <BookingModal
          item={selected}
          type="place"
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

export default Places
