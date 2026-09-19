import { useState, useEffect } from 'react'
import axios from 'axios'
import BookingModal from '../components/BookingModal'

function Hotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedHotel, setSelectedHotel] = useState(null)

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/hotels/')
      .then(res => { setHotels(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', padding: '40px 20px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '36px' }}>🏨 Hotels in Lebanon</h2>
      <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Find the best hotels across all governorates</p>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading hotels...</p>
      ) : hotels.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No hotels yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px', maxWidth: '1200px', margin: '40px auto'
        }}>
          {hotels.map(hotel => (
            <div key={hotel.id} style={{
              background: '#16213e', borderRadius: '15px', padding: '25px',
              border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
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