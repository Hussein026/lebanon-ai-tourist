import { useState } from 'react'

export default function CardImage({ src, alt }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return null
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{
        width: '100%', height: '180px', objectFit: 'cover',
        borderRadius: '10px', marginBottom: '15px', display: 'block'
      }}
    />
  )
}
