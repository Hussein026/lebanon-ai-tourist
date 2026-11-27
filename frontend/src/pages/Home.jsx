import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API = 'http://localhost:8001/api'

const KINDS = [
  { key: 'hotels', label: 'Hotels' },
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'places', label: 'Places' },
  { key: 'activities', label: 'Activities' },
]

const features = [
  { icon: '\u{1F916}', title: 'AI Guide', desc: 'Ask about hotels, restaurants, places and activities. The AI answers only from our stored listings, in English.' },
  { icon: '\u{1F5FA}', title: 'Interactive Map', desc: 'See all listings on a live map and click a pin for details.' },
  { icon: '\u{1F399}', title: 'Voice Guide', desc: 'Listen to audio descriptions for selected places.' },
  { icon: '\u{1F3F7}', title: 'Offers and Reviews', desc: 'See offers for your user group and read or write ratings.' },
  { icon: '\u{1F3E8}', title: 'Booking Requests', desc: 'Send a booking request and open WhatsApp with a ready message.' },
  { icon: '\u{1F97E}', title: 'Hiking Routes', desc: 'Trail routes with distance, difficulty and a line on the map.' },
]

function Home() {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    KINDS.forEach(k => {
      fetch(`${API}/${k.key}/`)
        .then(r => r.json())
        .then(d => {
          const n = Array.isArray(d) ? d.length : (typeof d.count === 'number' ? d.count : null)
          if (n !== null) setCounts(c => ({ ...c, [k.key]: n }))
        })
        .catch(() => {})
    })
  }, [])

  const stats = KINDS.filter(k => counts[k.key] !== undefined)

  return (
    <div style={{ paddingTop: '70px' }}>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a1e 50%, #0a1628 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(233,69,96,0.1)',
            border: '1px solid rgba(233,69,96,0.3)',
            borderRadius: '25px',
            padding: '8px 20px',
            fontSize: '14px',
            color: '#e94560',
            marginBottom: '30px',
            fontWeight: '600'
          }}>
            {'\u{1F1F1}\u{1F1E7}'} AI Tourism Platform for Lebanon
          </div>

          <h1 style={{
            fontSize: '72px',
            fontWeight: '900',
            lineHeight: '1.1',
            marginBottom: '25px',
            background: 'linear-gradient(135deg, #ffffff 0%, #a8b2d8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Discover<br />
            <span style={{
              background: 'linear-gradient(135deg, #e94560, #f5a623)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Lebanon</span>
          </h1>

          <p style={{
            fontSize: '20px',
            color: '#a8b2d8',
            maxWidth: '600px',
            lineHeight: '1.8',
            marginBottom: '50px'
          }}>
            Find hotels, restaurants, historical places and activities,
            with an AI guide that answers from our listings.
          </p>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/chat" style={{
              background: 'linear-gradient(135deg, #e94560, #f5a623)',
              color: 'white',
              padding: '18px 40px',
              borderRadius: '35px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '700',
              boxShadow: '0 8px 30px rgba(233,69,96,0.4)',
            }}>
              {'\u{1F916}'} Chat with AI Guide
            </Link>
            <Link to="/places" style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              padding: '18px 40px',
              borderRadius: '35px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '700',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              {'\u{1F3DB}'} Explore Places
            </Link>
          </div>

          {stats.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '50px',
              marginTop: '80px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {stats.map(s => (
                <div key={s.key} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '42px',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #e94560, #f5a623)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>{counts[s.key]}</div>
                  <div style={{ color: '#a8b2d8', fontSize: '14px', marginTop: '5px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{
        background: '#0d0d18',
        padding: '100px 40px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '800',
          marginBottom: '15px',
          color: 'white'
        }}>What You Can Do</h2>
        <p style={{ color: '#a8b2d8', fontSize: '16px', marginBottom: '60px' }}>
          Built for visitors to Lebanon
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '35px 30px',
              textAlign: 'left',
              cursor: 'default'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>{f.icon}</div>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ color: '#a8b2d8', lineHeight: '1.7', fontSize: '14px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1a0a1e, #0a1628)',
        padding: '100px 40px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '20px' }}>
          Ready to Explore Lebanon?
        </h2>
        <p style={{ color: '#a8b2d8', fontSize: '18px', marginBottom: '40px' }}>
          Ask our AI guide about hotels, restaurants, places and activities
        </p>
        <Link to="/chat" style={{
          background: 'linear-gradient(135deg, #e94560, #f5a623)',
          color: 'white',
          padding: '20px 50px',
          borderRadius: '35px',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: '700',
          boxShadow: '0 8px 30px rgba(233,69,96,0.4)',
        }}>
          Start Exploring
        </Link>
      </div>

    </div>
  )
}

export default Home