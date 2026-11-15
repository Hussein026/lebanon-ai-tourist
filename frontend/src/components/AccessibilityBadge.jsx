const LABELS = {
  accessible: { text: '♿ Wheelchair accessible', color: '#4CAF50' },
  partial: { text: '♿ Partly accessible', color: '#f5a623' },
  not_accessible: { text: '♿ Not accessible', color: '#e94560' },
}

export default function AccessibilityBadge({ value }) {
  const info = LABELS[value]
  if (!info) return null
  return (
    <p style={{ color: info.color, margin: '5px 0', fontSize: '14px', fontWeight: '600' }}>
      {info.text}
    </p>
  )
}
