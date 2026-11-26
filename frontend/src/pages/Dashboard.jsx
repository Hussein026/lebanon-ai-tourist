import { useState, useEffect } from 'react'

const API = 'http://localhost:8001/api/analytics'

const STAT_CARDS = [
  { key: 'bookings', label: 'Total Bookings', icon: '\u{1F4CB}', color: '#e94560' },
  { key: 'hotels', label: 'Hotels', icon: '\u{1F3E8}', color: '#f5a623' },
  { key: 'restaurants', label: 'Restaurants', icon: '\u{1F37D}', color: '#4CAF50' },
  { key: 'places', label: 'Places', icon: '\u{1F3DB}', color: '#2196F3' },
  { key: 'activities', label: 'Activities', icon: '\u{1F3AF}', color: '#9C27B0' },
  { key: 'pending', label: 'Pending', icon: '\u23F3', color: '#FF9800' },
  { key: 'confirmed', label: 'Confirmed', icon: '\u2705', color: '#4CAF50' },
  { key: 'cancelled', label: 'Cancelled', icon: '\u274C', color: '#f44336' },
]

const box = { background: '#1a1a2e', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)
  const [activePage, setActivePage] = useState('overview')

  const authHeaders = () => {
    const token = localStorage.getItem('access_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchData = () => {
    if (!localStorage.getItem('access_token')) {
      setDenied(true)
      setLoading(false)
      return
    }
    fetch(`${API}/dashboard/`, { headers: authHeaders() })
      .then(r => {
        if (r.status === 401 || r.status === 403) {
          setDenied(true)
          setLoading(false)
          return null
        }
        return r.json()
      })
      .then(d => { if (d) { setData(d); setLoading(false) } })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const updateStatus = async (id, status) => {
    await fetch(`${API}/bookings/${id}/status/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ status })
    })
    fetchData()
  }

  const statusColor = s => s === 'confirmed' ? '#4CAF50' : s === 'cancelled' ? '#f44336' : '#FF9800'

  const navItems = [
    { key: 'overview', icon: '\u{1F4CA}', label: 'Overview' },
    { key: 'bookings', icon: '\u{1F4CB}', label: 'Bookings' },
    { key: 'analytics', icon: '\u{1F4C8}', label: 'Analytics' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a8b2d8' }}>Loading dashboard...</p>
    </div>
  )

  if (denied) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', paddingTop: '70px' }}>
      <h2 style={{ color: '#e94560', margin: 0 }}>Access denied</h2>
      <p style={{ color: '#a8b2d8', margin: 0 }}>Only Ministry accounts can open this dashboard.</p>
    </div>
  )

  const totalBookings = data?.totals.bookings || 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f', paddingTop: '70px' }}>

      <div style={{
        width: '240px', background: '#1a1a2e', borderRight: '1px solid rgba(233,69,96,0.15)',
        padding: '30px 0', display: 'flex', flexDirection: 'column', position: 'fixed',
        top: '70px', bottom: 0, left: 0
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{'\u{1F3DB}'} Ministry</div>
          <div style={{ color: '#a8b2d8', fontSize: '12px', marginTop: '4px' }}>Tourism Dashboard</div>
        </div>

        <nav style={{ padding: '16px 0' }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActivePage(item.key)} style={{
              width: '100%', padding: '14px 24px', display: 'flex', alignItems: 'center',
              gap: '12px', background: activePage === item.key ? 'rgba(233,69,96,0.1)' : 'transparent',
              border: 'none', borderLeft: activePage === item.key ? '3px solid #e94560' : '3px solid transparent',
              color: activePage === item.key ? '#e94560' : '#a8b2d8',
              cursor: 'pointer', fontSize: '14px', fontWeight: activePage === item.key ? '700' : '500',
              textAlign: 'left'
            }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <button onClick={fetchData} style={{
          margin: 'auto 16px 16px', padding: '10px',
          background: 'rgba(233,69,96,0.1)', color: '#e94560',
          border: '1px solid rgba(233,69,96,0.3)', borderRadius: '10px',
          cursor: 'pointer', fontWeight: '600', fontSize: '13px'
        }}>{'\u{1F504}'} Refresh</button>
      </div>

      <div style={{ marginLeft: '240px', flex: 1, padding: '30px' }}>

        {activePage === 'overview' && (
          <>
            <h2 style={{ color: '#fff', margin: '0 0 24px', fontSize: '22px' }}>Overview</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '30px' }}>
              {STAT_CARDS.map(card => (
                <div key={card.key} style={{ background: '#1a1a2e', borderRadius: '14px', padding: '22px', border: `1px solid ${card.color}30` }}>
                  <div style={{ fontSize: '26px', marginBottom: '8px' }}>{card.icon}</div>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: card.color }}>{data?.totals[card.key] ?? 0}</div>
                  <div style={{ color: '#a8b2d8', fontSize: '12px', marginTop: '4px' }}>{card.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div style={box}>
                <h3 style={{ margin: '0 0 20px', color: '#fff' }}>Bookings by Type</h3>
                {data?.bookings_by_type.map(item => (
                  <div key={item.booking_type} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#a8b2d8', textTransform: 'capitalize' }}>{item.booking_type}</span>
                      <span style={{ color: '#fff', fontWeight: '700' }}>{item.count}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '8px' }}>
                      <div style={{ height: '8px', borderRadius: '4px', background: 'linear-gradient(135deg, #e94560, #f5a623)', width: `${totalBookings ? (item.count / totalBookings) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={box}>
                <h3 style={{ margin: '0 0 20px', color: '#fff' }}>Users per Segment</h3>
                {data?.users_per_segment.length === 0 ? (
                  <p style={{ color: '#a8b2d8' }}>No users yet.</p>
                ) : data?.users_per_segment.map(item => (
                  <div key={item.segment} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#a8b2d8', textTransform: 'capitalize' }}>{item.segment}</span>
                    <span style={{ color: '#fff', fontWeight: '700' }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={box}>
              <h3 style={{ margin: '0 0 20px', color: '#fff' }}>Monthly Bookings</h3>
              {data?.monthly_bookings.length === 0 ? (
                <p style={{ color: '#a8b2d8' }}>No monthly data yet.</p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px' }}>
                  {data?.monthly_bookings.map(m => (
                    <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>{m.count}</span>
                      <div style={{ width: '100%', background: 'linear-gradient(135deg, #e94560, #f5a623)', borderRadius: '4px 4px 0 0', height: `${(m.count / Math.max(...data.monthly_bookings.map(x => x.count))) * 100}px` }} />
                      <span style={{ color: '#a8b2d8', fontSize: '10px' }}>{m.month}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activePage === 'bookings' && (
          <>
            <h2 style={{ color: '#fff', margin: '0 0 24px', fontSize: '22px' }}>Recent Bookings</h2>
            <div style={box}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      {['ID', 'Type', 'Item', 'Guest', 'Email', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ color: '#a8b2d8', padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recent_bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px 16px', color: '#a8b2d8', fontSize: '13px' }}>#{b.id}</td>
                        <td style={{ padding: '12px 16px', color: '#fff', textTransform: 'capitalize', fontSize: '13px' }}>{b.booking_type}</td>
                        <td style={{ padding: '12px 16px', color: '#fff', fontSize: '13px' }}>{b.item_name}</td>
                        <td style={{ padding: '12px 16px', color: '#fff', fontSize: '13px' }}>{b.full_name}</td>
                        <td style={{ padding: '12px 16px', color: '#a8b2d8', fontSize: '13px' }}>{b.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: `${statusColor(b.status)}20`, color: statusColor(b.status), padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{b.status}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => updateStatus(b.id, 'confirmed')} style={{ background: '#4CAF5020', color: '#4CAF50', border: '1px solid #4CAF5040', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Confirm</button>
                            <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ background: '#f4433620', color: '#f44336', border: '1px solid #f4433640', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activePage === 'analytics' && (
          <>
            <h2 style={{ color: '#fff', margin: '0 0 24px', fontSize: '22px' }}>Analytics</h2>
            <div style={box}>
              <h3 style={{ color: '#fff', margin: '0 0 20px' }}>Top Booked Items</h3>
              {data?.bookings_by_governorate.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#fff', fontSize: '14px' }}>#{i + 1} {item.item_name}</span>
                  <span style={{ color: '#e94560', fontWeight: '700' }}>{item.count} bookings</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
