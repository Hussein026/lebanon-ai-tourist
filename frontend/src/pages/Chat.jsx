import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const SUGGESTIONS = [
  'Which hotels are in Beirut?',
  'Tell me about Jeita Grotto',
  'Which hiking routes do you have?',
  'Are there offers for me?',
]

function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Marhaba! 🇱🇧 I am your Lebanon AI guide. I answer only from the LebanonAI listings: hotels, restaurants, places, activities, offers and hiking routes.',
      sources: []
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const content = (text !== undefined ? text : input).trim()
    if (!content || loading) return

    setMessages(prev => [...prev, { role: 'user', content, sources: [] }])
    setInput('')
    setLoading(true)

    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.post(
        'http://127.0.0.1:8001/api/chat/',
        { message: content, session_id: sessionId },
        { headers: token ? { Authorization: 'Bearer ' + token } : {}, timeout: 90000 }
      )
      setSessionId(response.data.session_id)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.message,
        sources: response.data.sources || []
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        sources: []
      }])
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a2e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '100px 20px 30px',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ color: '#e94560', marginBottom: '20px' }}>🤖 Lebanon AI Guide</h2>

      <div style={{
        width: '100%',
        maxWidth: '800px',
        background: '#16213e',
        borderRadius: '20px',
        padding: '20px',
        height: '55vh',
        overflowY: 'auto',
        marginBottom: '16px',
        boxSizing: 'border-box'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '15px'
          }}>
            <div style={{
              background: msg.role === 'user' ? '#e94560' : '#0f3460',
              color: 'white',
              padding: '12px 18px',
              borderRadius: msg.role === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
              maxWidth: '75%',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#a8b2d8' }}>
                  Sources: {msg.sources.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: '#a8b2d8', textAlign: 'center' }}>
            AI is thinking... 🤔
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
        width: '100%', maxWidth: '800px', marginBottom: '12px'
      }}>
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => sendMessage(s)} disabled={loading} style={{
            background: 'rgba(255,255,255,0.06)', color: '#a8b2d8',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px',
            padding: '6px 14px', fontSize: '13px', cursor: 'pointer'
          }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '800px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about hotels, restaurants, places, activities, offers or hiking..."
          style={{
            flex: 1,
            padding: '15px 20px',
            borderRadius: '30px',
            border: '1px solid #0f3460',
            background: '#16213e',
            color: 'white',
            fontSize: '15px',
            outline: 'none'
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          style={{
            background: '#e94560',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '15px 30px',
            fontSize: '15px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
