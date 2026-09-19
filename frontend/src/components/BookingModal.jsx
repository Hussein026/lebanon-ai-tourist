import { useState } from 'react'

export default function BookingModal({ item, type, onClose }) {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', nationality: '',
    check_in: '', check_out: '', guests: 1, special_requests: ''
  })
  const [status, setStatus] = useState(null)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.full_name || !form.email || !form.phone) {
      setStatus('missing')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('http://localhost:8001/api/bookings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_type: type,
          item_id: item.id,
          item_name: item.name,
          ...form
        })
      })
      if (res.ok) setStatus('success')
      else {
        const data = await res.json()
        console.error('Booking error:', data)
        setStatus('error')
      }
    } catch (err) {
      console.error('Network error:', err)
      setStatus('error')
    }
  }

  const whatsappMsg = `Hi! I'd like to book ${item.name}. Name: ${form.full_name}, Phone: ${form.phone}, Check-in: ${form.check_in}, Guests: ${form.guests}`
  const whatsappUrl = `https://wa.me/96170000000?text=${encodeURIComponent(whatsappMsg)}`

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px'
    }}>
      <div style={{
        background: '#1a1a2e', borderRadius: '16px', padding: '32px',
        width: '100%', maxWidth: '500px', maxHeight: '90vh',
        overflowY: 'auto', border: '1px solid rgba(233,69,96,0.3)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '22px' }}>Book {item.name}</h2>
            <p style={{ color: '#a8b2d8', margin: '4px 0 0', fontSize: '13px', textTransform: 'capitalize' }}>{type}</p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#a8b2d8',
            fontSize: '24px', cursor: 'pointer'
          }}>✕</button>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '48px' }}>✅</div>
            <h3 style={{ color: '#fff', marginTop: '16px' }}>Booking Received!</h3>
            <p style={{ color: '#a8b2d8' }}>We'll contact you shortly to confirm.</p>
            <button onClick={onClose} style={{
              marginTop: '16px', padding: '12px 32px',
              background: 'linear-gradient(135deg, #e94560, #f5a623)',
              border: 'none', borderRadius: '25px', color: '#fff',
              fontWeight: '700', cursor: 'pointer'
            }}>Done</button>
          </div>
        ) : (
          <>
            {[
              { label: 'Full Name *', name: 'full_name', type: 'text' },
              { label: 'Email *', name: 'email', type: 'email' },
              { label: 'Phone *', name: 'phone', type: 'tel' },
              { label: 'Nationality', name: 'nationality', type: 'text' },
              { label: 'Check-in Date', name: 'check_in', type: 'date' },
              { label: 'Check-out Date', name: 'check_out', type: 'date' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: '16px' }}>
                <label style={{ color: '#a8b2d8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                <input
                  name={f.name} type={f.type} value={form[f.name]}
                  onChange={handle}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: '#0f0f23', border: status === 'missing' && !form[f.name] && ['full_name','email','phone'].includes(f.name)
                      ? '1px solid #e94560' : '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '14px', boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#a8b2d8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Guests</label>
              <input
                name="guests" type="number" min="1" max="20"
                value={form.guests} onChange={handle}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  background: '#0f0f23', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '14px', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#a8b2d8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Special Requests</label>
              <textarea
                name="special_requests" value={form.special_requests} onChange={handle}
                rows={3}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  background: '#0f0f23', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical'
                }}
              />
            </div>

            <button
              onClick={submit}
              disabled={status === 'loading'}
              style={{
                width: '100%', padding: '14px',
                background: 'linear-gradient(135deg, #e94560, #f5a623)',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginBottom: '12px'
              }}
            >
              {status === 'loading' ? 'Submitting...' : 'Confirm Booking'}
            </button>

            <a href={whatsappUrl} target="_blank" rel="noreferrer" style={{
              display: 'block', width: '100%', padding: '14px',
              background: '#25D366', border: 'none', borderRadius: '10px',
              color: '#fff', fontWeight: '700', fontSize: '16px',
              textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box'
            }}>
              📱 Book via WhatsApp
            </a>

            {status === 'missing' && (
              <p style={{ color: '#f5a623', textAlign: 'center', marginTop: '12px' }}>
                ⚠️ Please fill in Name, Email and Phone.
              </p>
            )}
            {status === 'error' && (
              <p style={{ color: '#e94560', textAlign: 'center', marginTop: '12px' }}>
                ❌ Something went wrong. Please try again.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}