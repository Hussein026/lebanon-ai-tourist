import { useState, useEffect } from 'react'
import axios from 'axios'

function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/restaurants/')
      .then(res => {
        setRestaurants(res.data)
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
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '36px' }}>🍽️ Restaurants in Lebanon</h2>
      <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Discover the best Lebanese cuisine</p>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading restaurants...</p>
      ) : restaurants.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No restaurants yet. Add some from the admin panel.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px',
          maxWidth: '1200px',
          margin: '40px auto'
        }}>
          {restaurants.map(r => (
            <div key={r.id} style={{
              background: '#16213e',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ color: '#e94560', margin: '0 0 10px' }}>{r.name}</h3>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>📍 {r.location}</p>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>🍴 {r.cuisine_type}</p>
              <p style={{ color: '#a8b2d8', margin: '5px 0' }}>💰 {r.price_range}</p>
              {r.is_vegetarian && (
                <p style={{ color: '#4CAF50', margin: '5px 0' }}>🌱 Vegetarian Friendly</p>
              )}
              <p style={{ color: 'white', margin: '15px 0 0', lineHeight: '1.5', fontSize: '14px' }}>
                {r.description}
              </p>
              {r.phone && (
                <a href={`https://wa.me/${r.phone.replace(/\D/g,'')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '15px',
                    background: '#25D366',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                  📱 Reserve via WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Restaurants