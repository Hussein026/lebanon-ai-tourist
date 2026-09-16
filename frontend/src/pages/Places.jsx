import { useState, useEffect } from 'react'
import axios from 'axios'

function Places() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/places/')
      .then(res => {
        setPlaces(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a2e',
      padding: '40px 20px',
      color: 'white'
    }}>
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '36px' }}>🏛️ Places in Lebanon</h2>
      <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Explore Lebanon's historical and natural wonders</p>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading places...</p>
      ) : places.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No places yet. Add some from the admin panel.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px',
          maxWidth: '1200px',
          margin: '40px auto'
        }}>
          {places.map(p => (
            <div key={p.id} style={{
              background: '#16213e',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ color: '#e94560', margin: '0 0 10px' }}>{p.name}</h3>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🏛️ {p.governorate}</p>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🏷️ {p.category}</p>
              {p.entrance_fee > 0 && (
                <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🎟️ ${p.entrance_fee}</p>
              )}
              {p.opening_hours && (
                <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🕐 {p.opening_hours}</p>
              )}
              <p style={{ color: 'white', margin: '15px 0 0', lineHeight: '1.5', fontSize: '14px' }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Places