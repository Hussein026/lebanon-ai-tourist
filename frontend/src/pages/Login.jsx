import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.username || !form.password) { setError('All fields required.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('http://localhost:8001/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('access_token', data.tokens.access)
        localStorage.setItem('refresh_token', data.tokens.refresh)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      } else {
        setError(data.error || 'Login failed.')
      }
    } catch { setError('Network error.') }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: '#1a1a2e', borderRadius: '20px', padding: '48px',
        width: '100%', maxWidth: '420px', border: '1px solid rgba(233,69,96,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '40px' }}>🇱🇧</span>
          <h2 style={{ color: '#fff', margin: '12px 0 4px', fontSize: '26px' }}>Welcome Back</h2>
          <p style={{ color: '#a8b2d8', fontSize: '14px' }}>Sign in to LebanonAI</p>
        </div>

        {[
          { label: 'Username', name: 'username', type: 'text' },
          { label: 'Password', name: 'password', type: 'password' },
        ].map(f => (
          <div key={f.name} style={{ marginBottom: '16px' }}>
            <label style={{ color: '#a8b2d8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
            <input
              name={f.name} type={f.type} value={form[f.name]}
              onChange={handle}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                background: '#0f0f23', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>
        ))}

        {error && <p style={{ color: '#e94560', fontSize: '13px', marginBottom: '12px' }}>⚠️ {error}</p>}

        <button onClick={submit} disabled={loading} style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, #e94560, #f5a623)',
          border: 'none', borderRadius: '10px', color: '#fff',
          fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '8px'
        }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ color: '#a8b2d8', textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          No account? <Link to="/register" style={{ color: '#e94560', fontWeight: '600' }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}