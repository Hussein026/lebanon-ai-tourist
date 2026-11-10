import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SEGMENTS = [
  { key: 'tourist', icon: '🧳', label: 'Tourist' },
  { key: 'student', icon: '🎓', label: 'Student' },
  { key: 'retired', icon: '🌿', label: 'Retired' },
]

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: '10px',
  background: '#0f0f23', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: '14px', boxSizing: 'border-box'
}
const labelStyle = { color: '#a8b2d8', fontSize: '13px', display: 'block', marginBottom: '6px' }

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirm: '',
    segment: 'tourist', nationality: '',
    university: '', student_id: '',
    health_conditions: '', mobility_issues: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = e => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const submit = async () => {
    if (!form.username || !form.email || !form.password) { setError('Username, email and password are required.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError('')
    try {
      const { confirm, ...payload } = form
      const res = await fetch('http://localhost:8001/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('access_token', data.tokens.access)
        localStorage.setItem('refresh_token', data.tokens.refresh)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
        window.location.reload()
      } else {
        setError(data.error || 'Registration failed.')
      }
    } catch { setError('Network error. Is the backend running on port 8001?') }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px'
    }}>
      <div style={{
        background: '#1a1a2e', borderRadius: '20px', padding: '40px',
        width: '100%', maxWidth: '460px', border: '1px solid rgba(233,69,96,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '40px' }}>🇱🇧</span>
          <h2 style={{ color: '#fff', margin: '12px 0 4px', fontSize: '26px' }}>Create Account</h2>
          <p style={{ color: '#a8b2d8', fontSize: '14px' }}>Join LebanonAI today</p>
        </div>

        <label style={labelStyle}>I am a...</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {SEGMENTS.map(s => (
            <button key={s.key} type="button"
              onClick={() => setForm({ ...form, segment: s.key })}
              style={{
                flex: 1, padding: '12px 6px', borderRadius: '12px', cursor: 'pointer',
                background: form.segment === s.key ? 'rgba(233,69,96,0.15)' : '#0f0f23',
                border: form.segment === s.key ? '1px solid #e94560' : '1px solid rgba(255,255,255,0.1)',
                color: form.segment === s.key ? '#e94560' : '#a8b2d8',
                fontWeight: '600', fontSize: '13px'
              }}>
              <div style={{ fontSize: '22px' }}>{s.icon}</div>
              {s.label}
            </button>
          ))}
        </div>

        {[
          { label: 'Username *', name: 'username', type: 'text' },
          { label: 'Email *', name: 'email', type: 'email' },
          { label: 'Nationality', name: 'nationality', type: 'text' },
        ].map(f => (
          <div key={f.name} style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{f.label}</label>
            <input name={f.name} type={f.type} value={form[f.name]} onChange={handle} style={inputStyle} />
          </div>
        ))}

        {form.segment === 'student' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>University</label>
              <input name="university" value={form.university} onChange={handle} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Student ID</label>
              <input name="student_id" value={form.student_id} onChange={handle} style={inputStyle} />
            </div>
          </>
        )}

        {form.segment === 'retired' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Health conditions (private, only you can see this)</label>
              <textarea name="health_conditions" value={form.health_conditions} onChange={handle}
                rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
              <input type="checkbox" name="mobility_issues" checked={form.mobility_issues} onChange={handle} />
              I have mobility issues
            </label>
          </>
        )}

        {[
          { label: 'Password *', name: 'password' },
          { label: 'Confirm Password *', name: 'confirm' },
        ].map(f => (
          <div key={f.name} style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{f.label}</label>
            <input name={f.name} type="password" value={form[f.name]} onChange={handle} style={inputStyle} />
          </div>
        ))}

        {error && <p style={{ color: '#e94560', fontSize: '13px', marginBottom: '12px' }}>⚠️ {error}</p>}

        <button onClick={submit} disabled={loading} style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, #e94560, #f5a623)',
          border: 'none', borderRadius: '10px', color: '#fff',
          fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '8px'
        }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p style={{ color: '#a8b2d8', textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#e94560', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
