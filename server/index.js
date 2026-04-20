import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import coursesRouter from './routes/courses.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const r = await pool.query('SELECT NOW() as now');
  res.json({ ok: true, dbTime: r.rows[0].now });
});

app.use('/api/courses', coursesRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`API on http://${HOST}:${PORT}`);
});