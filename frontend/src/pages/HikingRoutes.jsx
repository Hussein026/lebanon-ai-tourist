import { useState, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const DIFFICULTY = {
  easy: { text: 'Easy', color: '#4CAF50' },
  moderate: { text: 'Moderate', color: '#f5a623' },
  hard: { text: 'Hard', color: '#e94560' },
  unknown: { text: 'Not rated', color: '#a8b2d8' },
}

function FitRoute({ path }) {
  const map = useMap()
  useEffect(() => {
    const pts = Array.isArray(path) ? path.flat() : []
    if (pts.length > 1) map.fitBounds(pts, { padding: [30, 30] })
  }, [path, map])
  return null
}

export default function HikingRoutes() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/routes/')
      .then(res => {
        setRoutes(res.data)
        if (res.data.length) setSelectedId(res.data[0].id)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const selected = routes.find(r => r.id === selectedId) || null

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', padding: '100px 20px 40px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#e94560', fontSize: '36px' }}>🥾 Hiking Routes</h2>
      <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Real marked trails in Lebanon, with distance measured from the map data</p>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>Loading routes...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#e94560' }}>Could not load routes. Is the backend running?</p>
      ) : routes.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a8b2d8' }}>No routes yet.</p>
      ) : (
        <div style={{
          display: 'flex', gap: '20px', flexWrap: 'wrap',
          maxWidth: '1200px', margin: '30px auto 0'
        }}>
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '560px', overflowY: 'auto' }}>
            {routes.map(r => {
              const d = DIFFICULTY[r.difficulty] || DIFFICULTY.unknown
              const active = r.id === selectedId
              return (
                <div key={r.id} onClick={() => setSelectedId(r.id)} style={{
                  background: '#16213e', borderRadius: '12px', padding: '16px', cursor: 'pointer',
                  border: active ? '2px solid #e94560' : '1px solid rgba(255,255,255,0.1)'
                }}>
                  <h3 style={{ color: '#e94560', margin: '0 0 8px', fontSize: '17px' }}>{r.name}</h3>
                  <p style={{ color: '#a8b2d8', margin: '4px 0', fontSize: '14px' }}>🏛️ {r.region}</p>
                  <p style={{ color: '#a8b2d8', margin: '4px 0', fontSize: '14px' }}>📏 {Number(r.distance_km).toFixed(1)} km</p>
                  <p style={{ color: d.color, margin: '4px 0', fontSize: '14px', fontWeight: '700' }}>⛰️ {d.text}</p>
                  {r.description && (
                    <p style={{ color: 'white', margin: '8px 0 0', fontSize: '13px', lineHeight: '1.5' }}>{r.description}</p>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ flex: '2 1 480px', minHeight: '560px' }}>
            <MapContainer center={[33.95, 35.8]} zoom={9} style={{ height: '560px', borderRadius: '12px' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {selected && Array.isArray(selected.path) && (
                <>
                  <Polyline positions={selected.path} pathOptions={{ color: '#e94560', weight: 4 }} />
                  {selected.start_lat && selected.start_lng && (
                    <CircleMarker center={[selected.start_lat, selected.start_lng]} radius={8}
                      pathOptions={{ color: '#fff', fillColor: '#4CAF50', fillOpacity: 1 }}>
                      <Popup>Start: {selected.name}</Popup>
                    </CircleMarker>
                  )}
                  <FitRoute path={selected.path} />
                </>
              )}
            </MapContainer>
            <p style={{ color: '#a8b2d8', fontSize: '12px', margin: '8px 0 0' }}>
              Route data: © OpenStreetMap contributors (ODbL). Difficulty is shown only when the map data has a rating.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
