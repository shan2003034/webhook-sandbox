import { useState } from 'react'
import './App.css'

function App() {
  
  const [targetUrl, setTargetUrl] = useState('http://localhost:8080/api/webhook')
  const [orderId, setOrderId] = useState('ORD-505')
  const [amount, setAmount] = useState('1500.00')
  const [status, setStatus] = useState('SUCCESS')

  const sendWebhook = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          target_url: targetUrl,
          order_id: orderId,
          amount: amount,
          status: status,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message} (Status: ${data.status})`);
      } else {
        alert('❌ Sending webhook failed! Check if the target server is running.');
      }
    } catch (error) {
      console.error(error);
      alert('❌ Unable to connect to the backend.');
    }
  }

  return (
    <div className="container">
      <h1>🚀 Webhook Sandbox</h1>
      <div className="card">
        <h3>Simulate Payment</h3>
        
        
        <div className="input-group">
          <label>Target Backend URL </label>
          <input 
            type="text" 
            value={targetUrl} 
            onChange={(e) => setTargetUrl(e.target.value)} 
            style={{ borderColor: '#007bff' }} 
          />
        </div>

        <div className="input-group">
          <label>Order ID</label>
          <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Amount (LKR)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Payment Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="SUCCESS">✅ Success</option>
            <option value="FAILED">❌ Failed</option>
            <option value="PENDING">⏳ Pending</option>
          </select>
        </div>

        <button onClick={sendWebhook} className="btn-send">Send Webhook</button>
      </div>
    </div>
  )
}

export default App