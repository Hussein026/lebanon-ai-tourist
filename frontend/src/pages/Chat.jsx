import { useState } from 'react'
import axios from 'axios'

function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Marhaba! 🇱🇧 I am your Lebanon AI guide. Ask me anything about hotels, restaurants, places, or activities in Lebanon!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('http://127.0.0.1:8001/api/chat/', {
        message: input,
        session_id: sessionId
      })
      setSessionId(response.data.session_id)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.message
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
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
      padding: '30px 20px'
    }}>
      <h2 style={{ color: '#e94560', marginBottom: '20px' }}>🤖 Lebanon AI Guide</h2>

      <div style={{
        width: '100%',
        maxWidth: '800px',
        background: '#16213e',
        borderRadius: '20px',
        padding: '20px',
        height: '60vh',
        overflowY: 'auto',
        marginBottom: '20px'
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
              maxWidth: '70%',
              lineHeight: '1.5'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: '#a8b2d8', textAlign: 'center' }}>
            AI is thinking... 🤔
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        width: '100%',
        maxWidth: '800px'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about Lebanon... (in Arabic, English or French)"
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
          onClick={sendMessage}
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