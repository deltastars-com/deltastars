
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Mock Database (Cloud-ready structure)
  let db = {
    products: [],
    orders: [],
    users: [],
    settings: {
        maintenance: false,
        version: '62.0'
    }
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: db.settings.version });
  });

  app.get('/api/products', (req, res) => {
    res.json(db.products);
  });

  app.post('/api/orders', (req, res) => {
    const order = { ...req.body, id: `ORD-${Date.now()}`, timestamp: new Date().toISOString() };
    db.orders.push(order);
    res.status(201).json(order);
  });

  app.get('/api/orders', (req, res) => {
    res.json(db.orders);
  });

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Delta Sovereign Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
