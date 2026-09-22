import { useState, useEffect } from 'react'

const STAT_CARDS = [
  { key: 'bookings', label: 'Total Bookings', icon: '📋', color: '#e94560' },
  { key: 'hotels', label: 'Hotels', icon: '🏨', color: '#f5a623' },
  { key: 'restaurants', label: 'Restaurants', icon: '🍽️', color: '#4CAF50' },
  { key: 'places', label: 'Places', icon: '🏛️', color: '#2196F3' },
  { key: 'activities', label: 'Activities', icon: '🎯', color: '#9C27B0' },
  { key: 'pending', label: 'Pending', icon: '⏳', color: '#FF9800' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', color: '#4CAF50' },
  { key: 'cancelled', label: 'Cancelled', icon: '❌', color: '#f44336' },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePage, setActivePage] = useState('overview')

  const fetchData = () => {
    fetch('http://localhost:8001/api/analytics/dashboard/')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:8001/api/analytics/bookings/${id}/status/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetchData()
  }

  const statusColor = s => s === 'confirmed' ? '#4CAF50' : s === 'cancelled' ? '#f44336' : '#FF9800'

  const navItems = [
    { key: 'overview', icon: '📊', label: 'Overview' },
    { key: 'bookings', icon: '📋', label: 'Bookings' },
    { key: 'analytics', icon: '📈', label: 'Analytics' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a8b2d8' }}>Loading dashboard...</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f', paddingTop: '70px' }}>

      {/* Sidebar */}
      <div style={{
        width: '240px', background: '#1a1a2e', borderRight: '1px solid rgba(233,69,96,0.15)',
        padding: '30px 0', display: 'flex', flexDirection: 'column', position: 'fixed',
        top: '70px', bottom: 0, left: 0
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>🏛️ Ministry</div>
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

        {/* Sidebar Stats */}
        <div style={{ padding: '16px', marginTop: 'auto' }}>
          {STAT_CARDS.slice(0, 5).map(card => (
            <div key={card.key} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 12px', marginBottom: '8px',
              background: 'rgba(255,255,255,0.03)', borderRadius: '10px',
              border: `1px solid ${card.color}20`
            }}>
              <span style={{ color: '#a8b2d8', fontSize: '13px' }}>{card.icon} {card.label}</span>
              <span style={{ color: card.color, fontWeight: '800', fontSize: '16px' }}>
                {data?.totals[card.key] ?? 0}
              </span>
            </div>
          ))}
        </div>

        <button onClick={fetchData} style={{
          margin: '0 16px 16px', padding: '10px',
          background: 'rgba(233,69,96,0.1)', color: '#e94560',
          border: '1px solid rgba(233,69,96,0.3)', borderRadius: '10px',
          cursor: 'pointer', fontWeight: '600', fontSize: '13px'
        }}>🔄 Refresh</button>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '30px' }}>

        {/* Overview Page */}
        {activePage === 'overview' && (
          <>
            <h2 style={{ color: '#fff', margin: '0 0 24px', fontSize: '22px' }}>Overview</h2>

            {/* Top stat cards */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '16px', marginBottom: '30px'
            }}>
              {STAT_CARDS.map(card => (
                <div key={card.key} style={{
                  background: '#1a1a2e', borderRadius: '14px', padding: '22px',
                  border: `1px solid ${card.color}30`
                }}>
                  <div style={{ fontSize: '26px', marginBottom: '8px' }}>{card.icon}</div>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: card.color }}>
                    {data?.totals[card.key] ?? 0}
                  </div>
                  <div style={{ color: '#a8b2d8', fontSize: '12px', marginTop: '4px' }}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ margin: '0 0 20px', color: '#fff' }}>📊 Bookings by Type</h3>
                {data?.bookings_by_type.map(item => (
                  <div key={item.booking_type} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#a8b2d8', textTransform: 'capitalize' }}>{item.booking_type}</span>
                      <span style={{ color: '#fff', fontWeight: '700' }}>{item.count}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '8px' }}>
                      <div style={{
                        height: '8px', borderRadius: '4px',
                        background: 'linear-gradient(135deg, #e94560, #f5a623)',
                        width: `${(item.count / data.totals.bookings) * 100}%`
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ margin: '0 0 20px', color: '#fff' }}>📈 Monthly Bookings</h3>
                {data?.monthly_bookings.length === 0 ? (
                  <p style={{ color: '#a8b2d8' }}>No monthly data yet.</p>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
                    {data?.monthly_bookings.map(m => (
                      <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>{m.count}</span>
                        <div style={{
                          width: '100%', background: 'linear-gradient(135deg, #e94560, #f5a623)',
                          borderRadius: '4px 4px 0 0',
                          height: `${(m.count / Math.max(...data.monthly_bookings.map(x => x.count))) * 100}px`
                        }} />
                        <span style={{ color: '#a8b2d8', fontSize: '10px' }}>{m.month}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Bookings Page */}
        {activePage === 'bookings' && (
          <>
            <h2 style={{ color: '#fff', margin: '0 0 24px', fontSize: '22px' }}>Recent Bookings</h2>
            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
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
                          <span style={{
                            background: `${statusColor(b.status)}20`, color: statusColor(b.status),
                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                          }}>{b.status}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => updateStatus(b.id, 'confirmed')} style={{
                              background: '#4CAF5020', color: '#4CAF50', border: '1px solid #4CAF5040',
                              padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                            }}>✅ Confirm</button>
                            <button onClick={() => updateStatus(b.id, 'cancelled')} style={{
                              background: '#f4433620', color: '#f44336', border: '1px solid #f4433640',
                              padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                            }}>❌ Cancel</button>
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

        {/* Analytics Page */}
        {activePage === 'analytics' && (
          <>
            <h2 style={{ color: '#fff', margin: '0 0 24px', fontSize: '22px' }}>Analytics</h2>
            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ color: '#fff', margin: '0 0 20px' }}>🏆 Top Booked Items</h3>
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