import { useState, useEffect } from 'react'
import axios from 'axios'
import { API, refreshSummary } from '../utils/reviewsApi'

function Stars({ value }) {
  return (
    <span style={{ color: '#f5a623', letterSpacing: '2px' }}>
      {'★'.repeat(value)}{'☆'.repeat(5 - value)}
    </span>
  )
}

export default function ReviewsModal({ type, item, onClose }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState(null)
  const token = localStorage.getItem('access_token')

  const load = () => {
    axios.get(API, { params: { type, id: item.id } })
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const submit = async () => {
    if (!rating) { setStatus('norating'); return }
    setStatus('saving')
    try {
      await axios.post(
        API,
        { listing_type: type, listing_id: item.id, rating, comment },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      setStatus('saved')
      setComment('')
      setRating(0)
      load()
      refreshSummary(type)
    } catch (err) {
      setStatus(err.response && err.response.status === 401 ? 'login' : 'error')
    }
  }

  const avg = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px'
    }}>
      <div style={{
        background: '#1a1a2e', borderRadius: '16px', padding: '28px',
        width: '100%', maxWidth: '520px', maxHeight: '90vh',
        overflowY: 'auto', border: '1px solid rgba(233,69,96,0.3)', color: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px' }}>Reviews: {item.name}</h2>
            <p style={{ color: '#f5a623', margin: '6px 0 0', fontWeight: '600' }}>
              {avg ? '⭐ ' + avg + ' (' + reviews.length + (reviews.length === 1 ? ' review)' : ' reviews)') : 'No reviews yet'}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#a8b2d8', fontSize: '24px', cursor: 'pointer'
          }}>✕</button>
        </div>

        {loading ? (
          <p style={{ color: '#a8b2d8' }}>Loading...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: '#a8b2d8' }}>Be the first to review this place.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {reviews.map(r => (
              <div key={r.id} style={{
                background: '#16213e', borderRadius: '10px', padding: '12px 14px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <strong>{r.username}</strong>
                  <span style={{ color: '#a8b2d8' }}>{new Date(r.updated_at).toLocaleDateString('en-GB')}</span>
                </div>
                <div style={{ margin: '4px 0' }}><Stars value={r.rating} /></div>
                {r.comment && <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
          {!token ? (
            <p style={{ color: '#f5a623', margin: 0 }}>Please sign in to write a review.</p>
          ) : (
            <>
              <p style={{ margin: '0 0 6px', fontWeight: '600' }}>Your review</p>
              <div>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setRating(n)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '30px', padding: '0 2px', color: n <= rating ? '#f5a623' : '#555'
                  }}>★</button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Write a comment (optional)"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px', marginTop: '8px',
                  background: '#0f0f23', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical'
                }}
              />
              <button onClick={submit} disabled={status === 'saving'} style={{
                width: '100%', marginTop: '10px', padding: '12px',
                background: 'linear-gradient(135deg, #e94560, #f5a623)',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer'
              }}>
                {status === 'saving' ? 'Saving...' : 'Submit review'}
              </button>
              <p style={{ color: '#a8b2d8', fontSize: '12px', margin: '8px 0 0' }}>
                One review per place. Sending again updates your previous review.
              </p>
              {status === 'norating' && <p style={{ color: '#f5a623', margin: '8px 0 0' }}>Please choose 1 to 5 stars.</p>}
              {status === 'saved' && <p style={{ color: '#4CAF50', margin: '8px 0 0' }}>✅ Review saved.</p>}
              {status === 'login' && <p style={{ color: '#f5a623', margin: '8px 0 0' }}>Your login expired. Please sign in again.</p>}
              {status === 'error' && <p style={{ color: '#e94560', margin: '8px 0 0' }}>❌ Something went wrong. Please try again.</p>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
