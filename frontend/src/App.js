import React, { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/items')
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));

    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ status: 'unreachable' }));
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto' }}>
      <h1>CI/CD Demo App</h1>
      <p>Backend status: <strong>{health ? health.status : 'loading...'}</strong></p>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
