import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  const q = await pool.query(`
    SELECT id, slug, name, description, category, brand, rating, review_count,
           price, old_price, stock_qty, image_url, is_active
    FROM products
    WHERE is_active = true
    ORDER BY created_at DESC
  `);
  res.json(q.rows);
});

router.get('/:id', async (req, res) => {
  const q = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (!q.rows.length) return res.status(404).json({ error: 'Product not found' });
  res.json(q.rows[0]);
});

export default router;