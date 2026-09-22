import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const links = [
    { path: '/', label: 'Home' },
    { path: '/hotels', label: '🏨 Hotels' },
    { path: '/restaurants', label: '🍽️ Restaurants' },
    { path: '/places', label: '🏛️ Places' },
    { path: '/map', label: '🗺️ Map' },
    { path: '/chat', label: '🤖 AI Chat' },
    { path: '/dashboard', label: '🏛️ Dashboard' },
    { path: '/activities', label: '🎯 Activities' },
  ]

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(233, 69, 96, 0.2)',
      padding: '0 40px', height: '70px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '28px' }}>🇱🇧</span>
        <span style={{
          fontSize: '22px', fontWeight: '800',
          background: 'linear-gradient(135deg, #e94560, #f5a623)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>LebanonAI</span>
      </Link>

      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        {links.map(link => (
          <Link key={link.path} to={link.path} style={{
            color: location.pathname === link.path ? '#e94560' : '#a8b2d8',
            textDecoration: 'none', fontSize: '14px',
            fontWeight: location.pathname === link.path ? '700' : '500',
            padding: '8px 16px', borderRadius: '25px',
            background: location.pathname === link.path ? 'rgba(233,69,96,0.1)' : 'transparent',
            border: location.pathname === link.path ? '1px solid rgba(233,69,96,0.3)' : '1px solid transparent',
          }}>
            {link.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#a8b2d8', fontSize: '14px' }}>👤 {user.username}</span>
            <button onClick={logout} style={{
              background: 'rgba(233,69,96,0.1)', color: '#e94560',
              padding: '10px 20px', borderRadius: '25px',
              border: '1px solid rgba(233,69,96,0.3)',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              color: '#a8b2d8', textDecoration: 'none',
              padding: '10px 20px', borderRadius: '25px',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '14px', fontWeight: '600'
            }}>Sign In</Link>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg, #e94560, #f5a623)',
              color: 'white', padding: '10px 24px', borderRadius: '25px',
              textDecoration: 'none', fontSize: '14px', fontWeight: '700',
              boxShadow: '0 4px 15px rgba(233,69,96,0.4)'
            }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar