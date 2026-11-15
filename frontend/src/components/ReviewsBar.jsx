import { useState, useEffect } from 'react'
import { loadSummary, subscribe } from '../utils/reviewsApi'
import ReviewsModal from './ReviewsModal'

export default function ReviewsBar({ type, item }) {
  const [info, setInfo] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let alive = true
    const update = () => {
      loadSummary(type).then(data => {
        if (alive) setInfo(data[String(item.id)] || null)
      })
    }
    update()
    const unsubscribe = subscribe(t => { if (t === type) update() })
    return () => { alive = false; unsubscribe() }
  }, [type, item.id])

  const label = info
    ? '⭐ ' + info.avg.toFixed(1) + ' (' + info.count + (info.count === 1 ? ' review)' : ' reviews)')
    : 'No reviews yet'

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0', flexWrap: 'wrap' }}>
        <span style={{ color: info ? '#f5a623' : '#a8b2d8', fontSize: '14px', fontWeight: '600' }}>{label}</span>
        <button onClick={() => setOpen(true)} style={{
          background: 'rgba(255,255,255,0.06)', color: '#fff',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px',
          padding: '4px 12px', fontSize: '13px', cursor: 'pointer'
        }}>
          💬 Reviews
        </button>
      </div>
      {open && <ReviewsModal type={type} item={item} onClose={() => setOpen(false)} />}
    </>
  )
}
