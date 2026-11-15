import { useState, useEffect } from 'react'
import axios from 'axios'
import BookingModal from '../components/BookingModal'
import CardImage from '../components/CardImage'

const selectStyle = {
  padding: '12px 18px', borderRadius: '25px',
  background: '#16213e', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer'
}

function Hotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [price, setPrice] = useState('all')

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/hotels/')
      .then(res => { setHotels(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const regions = [...new Set(hotels.map(h => h.governorate))].sort()
  const prices = [...new Set(hotels.map(h => h.price_range))].sort((a, b) => a.length - b.length)

  const filtered = hotels.filter(h => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      h.name.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      h.governorate.toLowerCase().includes(q)
    const matchRegion = region === 'all' || h.governorate === region
    const matchPrice = price === 'all' || h.price_range === price
    return matchSearch && matchRegion && matchPrice
  })

  const hasFilters = search !== '' || region !== 'all' || price !== 'all'

  function clearFilters() {
    setSearch('')
    setRegion('all')
    setPrice('all')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', padding: '100px 20px 40px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '36px' }}>🏨 Hotels in Lebanon</h2>
      <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Find the best hotels across all governorates</p>

      <div style={{ maxWidth: '500px', margin: '24px auto 16px' }}>
        <input
          placeholder="🔍 Search hotels, locations..."
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
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={price} onChange={e => setPrice(e.target.value)} style={selectStyle}>
          <option value="all">💰 All prices</option>
          {prices.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {hasFilters && (
          <button onClick={clearFilters} style={{
            ...selectStyle, background: 'rgba(233,69,96,0.15)', color: '#e94560', fontWeight: '600'
          }}>
            ✖ Clear filters
          </button>
        )}
      </div>

      {!loading && hotels.length > 0 && (
        <p style={{ textAlign: 'center', color: '#a8b2d8', fontSize: '13px', margin: '0 0 8px' }}>
          Showing {filtered.length} of {hotels.length} hotels
        </p>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading hotels...</p>
      ) : hotels.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No hotels yet.</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No hotels match your filters.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px', maxWidth: '1200px', margin: '24px auto'
        }}>
          {filtered.map(hotel => (
            <div key={hotel.id} style={{
              background: '#16213e', borderRadius: '15px', padding: '25px',
              border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <CardImage src={hotel.image_url} alt={hotel.name} />
              <h3 style={{ color: '#e94560', margin: '0 0 10px' }}>{hotel.name}</h3>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>📍 {hotel.location}</p>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🏛️ {hotel.governorate}</p>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>⭐ {hotel.stars} Stars</p>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>💰 {hotel.price_range}</p>
              <p style={{ color: 'white', margin: '15px 0 0', lineHeight: '1.5', fontSize: '14px' }}>
                {hotel.description}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedHotel(hotel)}
                  style={{
                    background: 'linear-gradient(135deg, #e94560, #f5a623)',
                    color: 'white', padding: '10px 20px', borderRadius: '20px',
                    border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}>
                  🏨 Book Now
                </button>
                {hotel.phone && (
                  <a href={`https://wa.me/${hotel.phone.replace(/\D/g, '')}`}
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

      {selectedHotel && (
        <BookingModal
          item={selectedHotel}
          type="hotel"
          onClose={() => setSelectedHotel(null)}
        />
      )}
    </div>
  )
}

export default Hotels
