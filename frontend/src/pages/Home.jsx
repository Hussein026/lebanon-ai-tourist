import { Link } from 'react-router-dom'

const stats = [
  { number: '6', label: 'Governorates' },
  { number: '100+', label: 'Hotels' },
  { number: '500+', label: 'Restaurants' },
  { number: '50+', label: 'Historical Sites' },
]

const features = [
  { icon: '🤖', title: 'AI Guide', desc: 'Chat in Arabic, English or French with your personal Lebanon travel assistant' },
  { icon: '🗺️', title: 'Interactive Map', desc: 'Explore all hotels, restaurants and places on a live map with routes' },
  { icon: '🎙️', title: 'Voice Guide', desc: 'Audio tours at Baalbek, Byblos and every historical site' },
  { icon: '📸', title: 'Photo Recognition', desc: 'Point your camera at any landmark and get instant AI description' },
  { icon: '🏨', title: 'Smart Booking', desc: 'AI books hotels and restaurants for you via WhatsApp instantly' },
  { icon: '🥾', title: 'Hiking Routes', desc: 'Detailed trail guides for Qadisha Valley, Cedars and more' },
]

function Home() {
  return (
    <div style={{ paddingTop: '70px' }}>

      {/* Hero */}
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
        {/* Background glow */}
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
            🇱🇧 Lebanon's First AI Tourism Platform
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
            Your AI-powered travel companion. Find hotels, restaurants,
            historical sites and activities — all guided by AI in Arabic,
            English and French.
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
              🤖 Chat with AI Guide
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
              🏛️ Explore Places
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '50px',
            marginTop: '80px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #e94560, #f5a623)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{s.number}</div>
                <div style={{ color: '#a8b2d8', fontSize: '14px', marginTop: '5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
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
        }}>Everything You Need</h2>
        <p style={{ color: '#a8b2d8', fontSize: '16px', marginBottom: '60px' }}>
          Powered by AI — built exclusively for Lebanon
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
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>{f.icon}</div>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ color: '#a8b2d8', lineHeight: '1.7', fontSize: '14px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a1e, #0a1628)',
        padding: '100px 40px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '20px' }}>
          Ready to Explore Lebanon?
        </h2>
        <p style={{ color: '#a8b2d8', fontSize: '18px', marginBottom: '40px' }}>
          Ask our AI anything — in your language
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
          Start for Free →
        </Link>
      </div>

    </div>
  )
}

export default Home