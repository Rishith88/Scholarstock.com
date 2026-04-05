import { useState, useRef, useEffect } from 'react';
import API_URL from '../config';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: '👋 Hi! I\'m your ScholarStock AI assistant. I can help you:\n\n• Find the perfect study materials\n• Understand rental plans\n• Get study tips & advice\n• Answer any questions\n\nHow can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  async function sendMessage() {
    const msg = input.trim();
    if (!msg || loading) return;
    setMessages(prev => [...prev, { text: msg, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, conversationHistory }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
        setConversationHistory(data.conversationHistory);
      } else {
        setMessages(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }]);
      }
    } catch {
      setMessages(prev => [...prev, { text: 'Sorry, I\'m having trouble connecting.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="chatbot-btn" onClick={() => setOpen(o => !o)} title="Chat with AI">💬</button>
      <div className={`chatbot-widget${open ? ' active' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-content">
            <div className="chatbot-avatar-icon">🤖</div>
            <div>
              <div className="chatbot-title">ScholarStock AI Assistant</div>
              <div className="chatbot-status">● Online</div>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="chatbot-messages" ref={messagesRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chatbot-message ${m.sender}`}>
              <div className="message-content" dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br>') }} />
            </div>
          ))}
          {loading && (
            <div className="chatbot-message bot">
              <div className="message-content">
                <div style={{ display: 'flex', gap: '5px', padding: '5px' }}>
                  <div style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%', animation: 'typing 1.4s infinite' }} />
                  <div style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%', animation: 'typing 1.4s infinite .2s' }} />
                  <div style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%', animation: 'typing 1.4s infinite .4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading}>Send</button>
        </div>
      </div>
    </>
  );
}
