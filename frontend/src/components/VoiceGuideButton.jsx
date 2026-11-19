import { useState, useEffect, useRef } from 'react'

let manifestPromise = null
let stopCurrent = null

function loadManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('/audio/manifest.json')
      .then(r => (r.ok ? r.json() : { places: {} }))
      .catch(() => ({ places: {} }))
  }
  return manifestPromise
}

export default function VoiceGuideButton({ placeId }) {
  const [file, setFile] = useState(null)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    let alive = true
    loadManifest().then(m => {
      const entry = m.places && m.places[String(placeId)]
      if (alive && entry) setFile(entry.file)
    })
    return () => {
      alive = false
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [placeId])

  if (!file) return null

  const toggle = () => {
    if (playing && audioRef.current) {
      audioRef.current.pause()
      setPlaying(false)
      return
    }
    if (stopCurrent) stopCurrent()
    const audio = new Audio('/audio/' + file)
    audioRef.current = audio
    audio.onended = () => setPlaying(false)
    audio.onerror = () => setPlaying(false)
    stopCurrent = () => {
      audio.pause()
      setPlaying(false)
    }
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }

  return (
    <button onClick={toggle} style={{
      background: playing ? 'linear-gradient(135deg, #e94560, #f5a623)' : 'rgba(255,255,255,0.06)',
      color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px',
      padding: '4px 12px', fontSize: '13px', cursor: 'pointer', margin: '4px 0'
    }}>
      {playing ? '⏹ Stop' : '🔊 Listen'}
    </button>
  )
}
