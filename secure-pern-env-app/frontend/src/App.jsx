import { useState, useEffect } from 'react';

function App() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from our Node backend
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    fetch(`${apiUrl}/api/requests`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => setRequests(data))
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>PERN Stack Containerized 🚀</h1>
      <p>This React frontend is fetching from our Express backend, which is connected to Postgres!</p>

      {error && <p style={{ color: 'red' }}>Error connecting to API: {error}</p>}
      
      <h2>Recent Database Pings:</h2>
      <ul>
        {requests.length === 0 && !error && <li>Loading or no data yet...</li>}
        {requests.map((req) => (
          <li key={req.id}>
            <strong>{new Date(req.timestamp).toLocaleTimeString()}:</strong> {req.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
