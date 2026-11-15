import { useState, useEffect } from 'react'
import axios from 'axios'

const SEGMENT_LABELS = {
  all: { text: '🌍 Everyone', color: '#a8b2d8' },
  tourist: { text: '🧳 Tourists', color: '#f5a623' },
  student: { text: '🎓 Students', color: '#4CAF50' },
  retired: { text: '🌿 Retired', color: '#e94560' },
}

function formatDate(d) {
  if (!d) return 'No end date'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Offers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    const url = 'http://127.0.0.1:8001/api/offers/'
    const token = localStorage.getItem('access_token')
    const load = async () => {
      try {
        const res = await axios.get(url, token ? { headers: { Authorization: 'Bearer ' + token } } : {})
        setOffers(res.data)
      } catch (err) {
        if (err.response && err.response.status === 401) {
          try {
            const res = await axios.get(url)
            setOffers(res.data)
          } catch {
            setError(true)
          }
        } else {
          setError(true)
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', padding: '100px 20px 40px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '36px' }}>🏷️ Offers &amp; Deals</h2>
      <p style={{ textAlign: 'center', color: '#a8b2d8' }}>
        {user
          ? `Offers for you (${user.segment || 'tourist'}) and for everyone`
          : 'Sign in to see offers for your segment'}
      </p>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading offers...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#e94560' }}>Could not load offers. Is the backend running?</p>
      ) : offers.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No offers available right now.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px', maxWidth: '1200px', margin: '40px auto'
        }}>
          {offers.map(o => {
            const seg = SEGMENT_LABELS[o.segment] || SEGMENT_LABELS.all
            return (
              <div key={o.id} style={{
                background: '#16213e', borderRadius: '15px', padding: '25px',
                border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}>
                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                  fontSize: '12px', fontWeight: '700', color: seg.color,
                  background: 'rgba(255,255,255,0.06)', marginBottom: '12px'
                }}>
                  {seg.text}
                </span>
                <h3 style={{ color: '#e94560', margin: '0 0 10px' }}>{o.title}</h3>
                {o.discount_text && (
                  <p style={{ color: '#f5a623', margin: '5px 0', fontWeight: '700' }}>💸 {o.discount_text}</p>
                )}
                {o.listing_name && (
                  <p style={{ color: '#a8b2d8', margin: '5px 0' }}>📍 {o.listing_name}</p>
                )}
                <p style={{ color: '#a8b2d8', margin: '5px 0', fontSize: '13px' }}>
                  🗓️ Valid until {formatDate(o.valid_to)}
                </p>
                {o.description && (
                  <p style={{ color: 'white', margin: '15px 0 0', lineHeight: '1.5', fontSize: '14px' }}>
                    {o.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Offers
