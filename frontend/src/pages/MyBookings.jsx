import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const statusColor = s => s === 'confirmed' ? '#4CAF50' : s === 'cancelled' ? '#f44336' : '#FF9800'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = localStorage.getItem('access_token')

  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetch('http://localhost:8001/api/bookings/me/', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(r => { if (!r.ok) throw new Error('failed'); return r.json() })
      .then(d => { setBookings(d); setLoading(false) })
      .catch(() => { setError('Could not load bookings. Please sign in again.'); setLoading(false) })
  }, [token])

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', padding: '100px 20px 40px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '32px' }}>My Bookings</h2>

      {!token ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>
          Please <Link to="/login" style={{ color: '#e94560' }}>sign in</Link> to see your bookings.
        </p>
      ) : loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#e94560' }}>{error}</p>
      ) : bookings.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>You have no bookings yet.</p>
      ) : (
        <div style={{ maxWidth: '800px', margin: '30px auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map(b => (
            <div key={b.id} style={{
              background: '#16213e', borderRadius: '14px', padding: '20px 24px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ color: '#e94560', fontWeight: '700', fontSize: '18px' }}>{b.item_name}</div>
                <div style={{ color: '#a8b2d8', fontSize: '13px', marginTop: '6px', textTransform: 'capitalize' }}>
                  {b.booking_type} | {b.check_in || 'no date'} | {b.guests} guest(s)
                </div>
              </div>
              <span style={{
                background: statusColor(b.status) + '20', color: statusColor(b.status),
                padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600'
              }}>{b.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
