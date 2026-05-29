import { useState, useEffect } from 'react'
import './App.css'

interface HistoryItem {
  id: string;
  orderId: string;
  status: string;
  time: string;
  success: boolean;
}

function App() {
  const [targetUrl, setTargetUrl] = useState('http://localhost:8080/api/webhook');
  const [orderId, setOrderId] = useState('ORD-505');
  const [amount, setAmount] = useState('1500.00');
  const [status, setStatus] = useState('SUCCESS');
  const [isSending, setIsSending] = useState(false);
  
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('webhook-history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('webhook-history', JSON.stringify(history));
  }, [history]);

  
  const shutdownServer = async () => {
    if (window.confirm("Are you sure you want to shut down the server?")) {
      try {
        await fetch('http://localhost:3000/api/shutdown', { method: 'POST' });
        alert("Server has been shut down. You can close this tab now.");
        window.close(); 
      } catch (e) {
        console.error(e);
      }
    }
  }

  const sendWebhook = async () => {
    setIsSending(true);
    let isSuccess = false;

    try {
      const response = await fetch('http://localhost:3000/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_url: targetUrl,
          order_id: orderId,
          amount: amount,
          status: status,
        }),
      });

      if (response.ok) {
        isSuccess = true;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
      
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        orderId,
        status,
        time: new Date().toLocaleTimeString(),
        success: isSuccess
      };
      
      setHistory([newItem, ...history]);
    }
  }

  const clearHistory = () => {
    setHistory([]);
  }

  return (
    <div className="app-container">
      <div className="glass-panel main-panel">
        
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="title">🚀 Webhook Sandbox</h1>
            <p className="subtitle">Modern Local Testing Environment</p>
          </div>
          <button 
            onClick={shutdownServer} 
            style={{ 
              background: '#ff3b30', 
              color: 'white', 
              border: 'none', 
              padding: '10px 16px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(255, 59, 48, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🛑 Stop Server
          </button>
        </div>
        
        <div className="form-container">
          <div className="floating-input-group">
            <input type="text" placeholder=" " value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} />
            <label>Target Backend URL</label>
          </div>

          <div className="floating-input-group">
            <input type="text" placeholder=" " value={orderId} onChange={(e) => setOrderId(e.target.value)} />
            <label>Order ID</label>
          </div>

          <div className="floating-input-group">
            <input type="number" placeholder=" " value={amount} onChange={(e) => setAmount(e.target.value)} />
            <label>Amount (LKR)</label>
          </div>

          <div className="input-group">
            <label className="static-label">Payment Status</label>
            <select className="modern-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="SUCCESS">✅ Success</option>
              <option value="FAILED">❌ Failed</option>
              <option value="PENDING">⏳ Pending</option>
            </select>
          </div>

          <button 
            className={`btn-send ${isSending ? 'sending' : ''}`} 
            onClick={sendWebhook}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send Webhook'}
          </button>
        </div>
      </div>

      <div className="glass-panel history-panel">
        <div className="history-header">
          <h3>🕒 Request History</h3>
          <button className="btn-clear" onClick={clearHistory}>Clear</button>
        </div>
        
        <div className="history-list">
          {history.length === 0 ? (
            <p className="no-history">No webhooks sent yet.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className={`history-item history-item-${item.status.toLowerCase()}`}>
                <div className="history-icon">
                  {item.status === 'SUCCESS' ? '✅' : item.status === 'FAILED' ? '❌' : '⏳'}
                </div>
                <div className="history-details">
                  <span className="history-order">{item.orderId}</span>
                  <span className={`history-status status-text-${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
                <div className="history-time">{item.time}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App