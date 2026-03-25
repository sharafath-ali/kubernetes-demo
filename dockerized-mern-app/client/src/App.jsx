import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const API_URL = "http://localhost:5000";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/api/items`);
      setItems(res.data.data);
    } catch (err) {
      setError("Failed to connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      setAdding(true);
      await axios.post(`${API_URL}/api/items`, {
        name: newName,
        description: newDesc,
      });
      setNewName("");
      setNewDesc("");
      fetchItems();
    } catch (err) {
      setError("Failed to add item.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/items/${id}`);
      fetchItems();
    } catch (err) {
      setError("Failed to delete item.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🐳</span>
            <span>Dockerized MERN</span>
          </div>
          <div className="stack-badges">
            <span className="badge mongo">MongoDB</span>
            <span className="badge express">Express</span>
            <span className="badge react">React</span>
            <span className="badge node">Node.js</span>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="hero">
          <h1>MERN Stack Running in Docker</h1>
          <p>Items are fetched from Express API → MongoDB via Docker Compose</p>
        </div>

        <div className="card form-card">
          <h2>Add New Item</h2>
          <form onSubmit={handleAdd} className="form">
            <input
              className="input"
              type="text"
              placeholder="Item name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <input
              className="input"
              type="text"
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={adding}>
              {adding ? "Adding..." : "+ Add Item"}
            </button>
          </form>
        </div>

        {error && (
          <div className="alert error">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="card">
          <div className="list-header">
            <h2>Items from MongoDB</h2>
            <button className="btn btn-ghost" onClick={fetchItems}>
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>Connecting to backend...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty">No items found. Add one above!</div>
          ) : (
            <ul className="item-list">
              {items.map((item) => (
                <li key={item._id} className="item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    {item.description && (
                      <span className="item-desc">{item.description}</span>
                    )}
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="api-info card">
          <h2>API Endpoint</h2>
          <code className="endpoint">GET http://localhost:5000/api/items</code>
          <p className="hint">The frontend calls this endpoint on every load and refresh.</p>
        </div>
      </main>

      <footer className="footer">
        <p>Dockerized MERN App · MongoDB + Express + React + Node.js</p>
      </footer>
    </div>
  );
}

export default App;
