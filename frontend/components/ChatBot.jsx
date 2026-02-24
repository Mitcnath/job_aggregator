import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! How can we help you find the perfect job?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/jobs/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: inputValue
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: data
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: `Sorry, I encountered an error: ${error.message}. Please make sure the backend is running on localhost:8080.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="chat-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with us"
      >
        💬
      </button>

      {isOpen && (
        <div className={`chat-box ${isExpanded ? 'expanded' : ''}`}>
          <div className="chat-header">
            <h3>Job Assistant</h3>
            <div className="chat-header-buttons">
              <button
                className="chat-resize"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize chat' : 'Expand chat'}
              >
                {isExpanded ? '⤲' : '⤳'}
              </button>
              <button
                className="chat-close"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.type}`}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot loading">
                <p>Typing...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-area">
            <form onSubmit={sendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="Ask me about jobs..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={isLoading || !inputValue.trim()}
                title="Send message"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
