import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CATEGORIES = ['all', 'hotels', 'restaurants', 'places']

export default function Map() {
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const endpoints = category === 'all'
      ? ['hotels', 'restaurants', 'places']
      : [category]

    setLoading(true)
    Promise.all(
      endpoints.map(ep =>
        fetch(`http://localhost:8001/api/${ep}/`)
          .then(r => r.json())
          .then(data => data.map(item => ({ ...item, _type: ep })))
      )
    )
      .then(results => setItems(results.flat()))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Filter Bar */}
      <div style={{
        display: 'flex', gap: '10px', padding: '12px 20px',
        background: '#1a1a2e', justifyContent: 'center'
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              background: category === cat ? '#e63946' : '#fff',
              color: category === cat ? '#fff' : '#333',
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      ) : (
        <MapContainer
          center={[33.8886, 35.4955]}
          zoom={9}
          style={{ flex: 1 }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {items.map((item, idx) =>
            item.latitude && item.longitude ? (
              <Marker key={idx} position={[item.latitude, item.longitude]}>
                <Popup>
                  <strong>{item.name}</strong><br />
                  {item._type}<br />
                  {item.location || item.address || ''}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      )}
    </div>
  )
}