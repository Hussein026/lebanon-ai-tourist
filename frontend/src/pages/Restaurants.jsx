import { useState, useEffect } from 'react'
import axios from 'axios'
import BookingModal from '../components/BookingModal'
import CardImage from '../components/CardImage'

const selectStyle = {
  padding: '12px 18px', borderRadius: '25px',
  background: '#16213e', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer'
}

function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [cuisine, setCuisine] = useState('all')
  const [price, setPrice] = useState('all')

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/restaurants/')
      .then(res => { setRestaurants(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const regions = [...new Set(restaurants.map(r => r.governorate))].sort()
  const cuisines = [...new Set(restaurants.map(r => r.cuisine_type))].sort()
  const prices = [...new Set(restaurants.map(r => r.price_range))].sort((a, b) => a.length - b.length)

  const filtered = restaurants.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      r.name.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.governorate.toLowerCase().includes(q) ||
      r.cuisine_type.toLowerCase().includes(q)
    const matchRegion = region === 'all' || r.governorate === region
    const matchCuisine = cuisine === 'all' || r.cuisine_type === cuisine
    const matchPrice = price === 'all' || r.price_range === price
    return matchSearch && matchRegion && matchCuisine && matchPrice
  })

  const hasFilters = search !== '' || region !== 'all' || cuisine !== 'all' || price !== 'all'

  function clearFilters() {
    setSearch('')
    setRegion('all')
    setCuisine('all')
    setPrice('all')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', padding: '100px 20px 40px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '36px' }}>🍽️ Restaurants in Lebanon</h2>
      <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Discover the best Lebanese cuisine</p>

      <div style={{ maxWidth: '500px', margin: '24px auto 16px' }}>
        <input
          placeholder="🔍 Search restaurants, locations, cuisine..."
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
        <select value={cuisine} onChange={e => setCuisine(e.target.value)} style={selectStyle}>
          <option value="all">🍴 All cuisines</option>
          {cuisines.map(x => <option key={x} value={x}>{x}</option>)}
        </select>
        <select value={price} onChange={e => setPrice(e.target.value)} style={selectStyle}>
          <option value="all">💰 All prices</option>
          {prices.map(x => <option key={x} value={x}>{x}</option>)}
        </select>
        {hasFilters && (
          <button onClick={clearFilters} style={{
            ...selectStyle, background: 'rgba(233,69,96,0.15)', color: '#e94560', fontWeight: '600'
          }}>
            ✖ Clear filters
          </button>
        )}
      </div>

      {!loading && restaurants.length > 0 && (
        <p style={{ textAlign: 'center', color: '#a8b2d8', fontSize: '13px', margin: '0 0 8px' }}>
          Showing {filtered.length} of {restaurants.length} restaurants
        </p>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading restaurants...</p>
      ) : restaurants.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No restaurants yet.</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No restaurants match your filters.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px', maxWidth: '1200px', margin: '24px auto'
        }}>
          {filtered.map(r => (
            <div key={r.id} style={{
              background: '#16213e', borderRadius: '15px', padding: '25px',
              border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <CardImage src={r.image_url} alt={r.name} />
              <h3 style={{ color: '#e94560', margin: '0 0 10px' }}>{r.name}</h3>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>📍 {r.location}</p>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🏛️ {r.governorate}</p>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🍴 {r.cuisine_type}</p>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>💰 {r.price_range}</p>
              {r.is_vegetarian && (
                <p style={{ color: '#4CAF50', margin: '5px 0' }}>🌱 Vegetarian Friendly</p>
              )}
              <p style={{ color: 'white', margin: '15px 0 0', lineHeight: '1.5', fontSize: '14px' }}>
                {r.description}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelected(r)}
                  style={{
                    background: 'linear-gradient(135deg, #e94560, #f5a623)',
                    color: 'white', padding: '10px 20px', borderRadius: '20px',
                    border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}>
                  🍽️ Reserve Now
                </button>
                {r.phone && (
                  <a href={`https://wa.me/${r.phone.replace(/\D/g, '')}`}
                    target="_blank" rel="noreferrer"
                    style={{
                      background: '#25D366', color: 'white', padding: '10px 20px',
                      borderRadius: '20px', textDecoration: 'none', fontSize: '14px', fontWeight: '600'
                    }}>
                    📱 WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <BookingModal
          item={selected}
          type="restaurant"
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

export default Restaurants
