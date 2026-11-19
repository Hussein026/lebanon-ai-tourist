import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CardImage from '../components/CardImage'

const URL = 'http://127.0.0.1:8001/api/recommendations/'
const PATHS = { hotel: '/hotels', restaurant: '/restaurants', place: '/places', activity: '/activities' }
const SEGMENT_TEXT = { tourist: 'tourists', student: 'students', retired: 'retired travellers' }

export default function ForYou() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const load = async () => {
      try {
        const res = await axios.get(URL, token ? { headers: { Authorization: 'Bearer ' + token } } : {})
        setData(res.data)
      } catch {
        setError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', padding: '100px 20px 40px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '36px' }}>⭐ Recommended for you</h2>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading...</p>
      ) : error || !data ? (
        <p style={{ textAlign: 'center', color: '#e94560' }}>Could not load recommendations. Is the backend running?</p>
      ) : (
        <>
          <p style={{ textAlign: 'center', color: '#a8b2d8' }}>
            {data.personalised
              ? 'Picks for ' + (SEGMENT_TEXT[data.segment] || data.segment) + ', based on your profile, ratings and offers'
              : 'Showing picks for tourists. Sign in to get picks for your own profile.'}
          </p>

          {data.groups.map(g => (
            <div key={g.type} style={{ maxWidth: '1200px', margin: '40px auto 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ color: '#f5a623', margin: 0 }}>{g.label}</h3>
                <Link to={PATHS[g.type]} style={{ color: '#a8b2d8', fontSize: '14px' }}>See all {g.label.toLowerCase()} →</Link>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px', marginTop: '14px'
              }}>
                {g.items.map(i => (
                  <div key={i.kind + i.id} style={{
                    background: '#16213e', borderRadius: '15px', padding: '20px',
                    border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                  }}>
                    <CardImage src={i.image_url} alt={i.name} />
                    <h4 style={{ color: '#e94560', margin: '0 0 8px', fontSize: '17px' }}>{i.name}</h4>
                    <p style={{ color: '#a8b2d8', margin: '3px 0', fontSize: '14px' }}>🏛️ {i.region}</p>
                    <p style={{ color: '#a8b2d8', margin: '3px 0', fontSize: '14px' }}>💰 {i.price}</p>
                    <ul style={{ margin: '10px 0 0', paddingLeft: '18px', color: i.ranked ? '#4CAF50' : '#a8b2d8', fontSize: '13px' }}>
                      {i.reasons.map(r => <li key={r}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
